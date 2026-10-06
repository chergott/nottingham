/** A stock order in the portfolio, as entered on the Add Stock Order form. */
export interface StockOrder {
  id: string;
  symbol: string;
  method: OrderMethod;
  type: OrderType;
  /** What one share cost (or sold for). */
  price: number;
  quantity: number;
  /** "YYYY-MM-DD". */
  date: string;
}

export const ORDER_METHODS = ["buy", "sell"] as const;
export type OrderMethod = (typeof ORDER_METHODS)[number];

export const ORDER_TYPES = ["market", "limit", "stop-loss", "stop-limit"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  market: "Market",
  limit: "Limit",
  "stop-loss": "Stop Loss",
  "stop-limit": "Stop Limit",
};

/** A stock's quote: today's opening price and what it's asking now. */
export interface Quote {
  symbol: string;
  name: string;
  open: number;
  ask: number;
}

export interface Returns {
  /** Since today's open: quantity × (ask − open). */
  today: number;
  /** Since the order: quantity × (ask − price). */
  total: number;
  /** total as a percentage of what the order cost. */
  totalPercent: number;
}

/**
 * An order's returns at the quote's prices. A sell is a short position, so the returns
 * run the other way. (The 2016 app showed ask ÷ price as the percent; this is the
 * percent change.)
 */
export function orderReturns(order: StockOrder, quote: Quote): Returns {
  const side = order.method === "sell" ? -1 : 1;
  const today = side * order.quantity * (quote.ask - quote.open);
  const total = side * order.quantity * (quote.ask - order.price);
  const totalPercent = order.price ? (side * (quote.ask - order.price) * 100) / order.price : 0;
  return { today, total, totalPercent };
}

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** "$1,234.50" or "−$80.00". */
export function formatDollars(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return rounded < 0 ? `−${dollars.format(-rounded)}` : dollars.format(rounded);
}

/** "+3.25%" or "−1.10%". */
export function formatPercent(percent: number): string {
  const rounded = Math.round(percent * 100) / 100;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${Math.abs(rounded).toFixed(2)}%`;
}
