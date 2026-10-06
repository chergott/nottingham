import type { Quote, StockOrder } from "../portfolio";

// Made-up companies and prices. The 2016 app got quotes from Yahoo's YQL service, which
// was shut down in 2019, so the demo quotes from this list instead.
export const SAMPLE_QUOTES: Quote[] = [
  { symbol: "SHWD", name: "Sherwood Timber Co.", open: 48.2, ask: 49.75 },
  { symbol: "LKSL", name: "Locksley Archery", open: 131.4, ask: 128.9 },
  { symbol: "MRAN", name: "Marian Textiles", open: 22.85, ask: 23.4 },
  { symbol: "TUCK", name: "Friar Tuck Breweries", open: 67.1, ask: 66.35 },
  { symbol: "NOTT", name: "Nottingham Castle Holdings", open: 214.6, ask: 219.2 },
  { symbol: "ARRW", name: "Arrowhead Robotics", open: 88.05, ask: 91.6 },
  { symbol: "LTJN", name: "Little John Freight", open: 35.5, ask: 34.95 },
  { symbol: "GSBN", name: "Gisborne Capital", open: 152.3, ask: 150.1 },
  { symbol: "TRNT", name: "Trent Valley Rail", open: 41.75, ask: 42.6 },
  { symbol: "OUTL", name: "Outlaw Software", open: 305.2, ask: 312.45 },
];

/** The portfolio the demo starts with. */
export const SAMPLE_ORDERS: StockOrder[] = [
  {
    id: "1",
    symbol: "SHWD",
    method: "buy",
    type: "market",
    price: 31.2,
    quantity: 40,
    date: "2016-08-15",
  },
  {
    id: "2",
    symbol: "OUTL",
    method: "buy",
    type: "limit",
    price: 285,
    quantity: 8,
    date: "2024-03-04",
  },
  {
    id: "3",
    symbol: "LKSL",
    method: "buy",
    type: "market",
    price: 140.5,
    quantity: 12,
    date: "2025-01-21",
  },
  {
    id: "4",
    symbol: "GSBN",
    method: "sell",
    type: "stop-loss",
    price: 162,
    quantity: 10,
    date: "2025-06-09",
  },
  {
    id: "5",
    symbol: "ARRW",
    method: "buy",
    type: "stop-limit",
    price: 76.25,
    quantity: 25,
    date: "2025-11-17",
  },
];
