/** The portfolio's model and math, as in react-app's Nottingham (utils/stocks.ts). */

export type StockSide = "buy" | "sell";

export const ORDER_TYPES = ["Market", "Limit", "Stop Loss", "Stop Limit"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

/** A filled order. A buy's `active` is how many of its shares are still held: sells use
 * up the oldest buys first. A sell's is 0. */
export interface StockOrder {
  /** "YYYY-MM-DD". */
  date: string;
  side: StockSide;
  type: OrderType;
  /** What one share cost (or sold for). */
  price: number;
  quantity: number;
  active: number;
}

export interface StockQuote {
  previousClose: number;
  lastTradePrice: number;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  quote: StockQuote;
  /** Newest first. */
  orders: StockOrder[];
}

/** A stock with what its held shares are worth and how they've done. */
export interface StockExtended extends Stock {
  /** Shares still held. */
  activeQuantity: number;
  /** Their worth at the last trade price. */
  activeValue: number;
  /** What they cost. */
  activeCost: number;
  /** One share's change since the previous close. */
  dayChange: number;
  dayPercentChange: number;
  /** The held shares' change since the previous close. */
  activeDayGainLoss: number;
  /** The held shares' change since they were bought. */
  activeTotalGainLoss: number;
  totalPercentChange: number;
  isDayUp: boolean;
}

export function extendStock(stock: Stock): StockExtended {
  const { lastTradePrice, previousClose } = stock.quote;
  const held = stock.orders.filter((order) => order.side === "buy" && order.active > 0);
  const activeQuantity = held.reduce((sum, order) => sum + order.active, 0);
  const activeValue = lastTradePrice * activeQuantity;
  const activeCost = held.reduce((sum, order) => sum + order.active * order.price, 0);
  const dayChange = lastTradePrice - previousClose;
  const dayPercentChange = (dayChange / previousClose) * 100;
  const activeTotalGainLoss = activeValue - activeCost;
  return {
    ...stock,
    activeQuantity,
    activeValue,
    activeCost,
    dayChange,
    dayPercentChange,
    activeDayGainLoss: dayChange * activeQuantity,
    activeTotalGainLoss,
    totalPercentChange: activeCost ? (activeTotalGainLoss / activeCost) * 100 : 0,
    isDayUp: dayPercentChange > 0,
  };
}

export type Timeline = "day" | "all";

export interface PortfolioSummary {
  /** What every held share is worth. */
  totalActiveValue: number;
  /** The change over the timeline: since the previous close, or since buying. */
  gainLoss: number;
  /** gainLoss as a percent of what the shares were worth at the timeline's start. */
  performance: number;
}

export function summarize(stocks: StockExtended[], timeline: Timeline): PortfolioSummary {
  let totalActiveValue = 0;
  let gainLoss = 0;
  for (const stock of stocks) {
    totalActiveValue += stock.activeValue;
    gainLoss += timeline === "day" ? stock.activeDayGainLoss : stock.activeTotalGainLoss;
  }
  const start = totalActiveValue - gainLoss;
  return { totalActiveValue, gainLoss, performance: start ? (gainLoss / start) * 100 : 0 };
}

/** react-app's toNiceNumber: "1,234.50", always positive (the sign is shown separately). */
export function toNiceNumber(number: number): string {
  const fixed = Math.abs(number).toFixed(2);
  return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Whether an amount shows as a gain (1), a loss (-1), or neither (0) once rounded to
 * cents, so its color agrees with its sign. */
export function gainSign(amount: number): 1 | -1 | 0 {
  if (toNiceNumber(amount) === "0.00") return 0;
  return amount > 0 ? 1 : -1;
}

/** "+$1,234.50" or "-$80.00"; an amount that rounds to $0.00 gets no sign. */
export function signedDollars(amount: number): string {
  const nice = toNiceNumber(amount);
  if (nice === "0.00") return "$0.00";
  return `${amount > 0 ? "+" : "-"}$${nice}`;
}

/** "+3.25%" or "-1.10%"; one that rounds to 0.00% gets no sign. */
export function signedPercent(percent: number): string {
  const nice = toNiceNumber(percent);
  if (nice === "0.00") return "0.00%";
  return `${percent > 0 ? "+" : "-"}${nice}%`;
}
