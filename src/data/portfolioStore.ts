import { useSyncExternalStore } from "react";
import type { Stock } from "../stocks";
import { sampleStocks } from "./sampleData";

/**
 * Where the portfolio comes from. The demo keeps it in the browser, starting from new
 * sample data on every load; a real quote provider would implement the same interface.
 */
export interface PortfolioStore {
  stocks(): Stock[];
  /** Gets the latest quotes and holdings. */
  refresh(): void;
  subscribe(onChange: () => void): () => void;
}

export function createSampleStore(): PortfolioStore {
  let stocks = sampleStocks();
  const listeners = new Set<() => void>();

  return {
    stocks: () => stocks,
    refresh() {
      stocks = sampleStocks();
      listeners.forEach((listener) => listener());
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
  };
}

export const store = createSampleStore();

/** The portfolio's stocks, re-rendering when they're refreshed. */
export function useStocks(): Stock[] {
  return useSyncExternalStore(store.subscribe, store.stocks);
}
