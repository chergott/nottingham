import { useSyncExternalStore } from "react";
import type { Quote, StockOrder } from "../portfolio";
import { SAMPLE_ORDERS, SAMPLE_QUOTES } from "./sampleData";

/**
 * Where the portfolio and quotes come from. The demo keeps both in the browser, starting
 * from sample data and resetting on reload; a real quote provider would implement the
 * same interface.
 */
export interface PortfolioStore {
  orders(): StockOrder[];
  add(order: Omit<StockOrder, "id">): StockOrder;
  update(order: StockOrder): void;
  remove(id: string): void;
  /** The quote for a symbol (any case), or null when there's none. */
  quote(symbol: string): Quote | null;
  /** Every symbol there's a quote for, for suggestions. */
  quotes(): Quote[];
  subscribe(onChange: () => void): () => void;
}

export function createSampleStore(): PortfolioStore {
  let orders = structuredClone(SAMPLE_ORDERS);
  let nextId = orders.length + 1;
  const listeners = new Set<() => void>();
  const changed = () => listeners.forEach((listener) => listener());
  const bySymbol = new Map(SAMPLE_QUOTES.map((quote) => [quote.symbol, quote]));

  return {
    orders: () => orders,
    add(order) {
      const added = { ...order, id: String(nextId++) };
      orders = [...orders, added];
      changed();
      return added;
    },
    update(order) {
      orders = orders.map((existing) => (existing.id === order.id ? order : existing));
      changed();
    },
    remove(id) {
      orders = orders.filter((order) => order.id !== id);
      changed();
    },
    quote: (symbol) => bySymbol.get(symbol.trim().toUpperCase()) ?? null,
    quotes: () => SAMPLE_QUOTES,
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
  };
}

export const store = createSampleStore();

/** The portfolio's orders, re-rendering when they change. */
export function useOrders(): StockOrder[] {
  return useSyncExternalStore(store.subscribe, store.orders);
}
