import { ORDER_TYPES, type Stock, type StockOrder, type StockQuote } from "../stocks";

// Familiar companies, as react-app's Nottingham used, each around a recent share price.
// The quotes and orders are made up around these prices, anew on every load and refresh.
// (react-app's 2017 list also had ATVI, FIT, NAKD, and NUAN, which no longer trade, and
// EA, which is going private; FB is META now, and Intel is INTC, not INTL.)
const COMPANIES = [
  { symbol: "AAPL", name: "Apple", price: 250 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 200 },
  { symbol: "AMZN", name: "Amazon", price: 220 },
  { symbol: "BBY", name: "Best Buy", price: 75 },
  { symbol: "CRM", name: "Salesforce", price: 250 },
  { symbol: "DIS", name: "Walt Disney", price: 110 },
  { symbol: "EBAY", name: "eBay", price: 85 },
  { symbol: "GOOGL", name: "Alphabet", price: 250 },
  { symbol: "INTC", name: "Intel", price: 35 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 190 },
  { symbol: "LOGI", name: "Logitech", price: 110 },
  { symbol: "LUV", name: "Southwest Airlines", price: 33 },
  { symbol: "META", name: "Meta Platforms", price: 700 },
  { symbol: "MSFT", name: "Microsoft", price: 500 },
  { symbol: "NFLX", name: "Netflix", price: 110 },
  { symbol: "NTDOY", name: "Nintendo", price: 20 },
  { symbol: "NVDA", name: "NVIDIA", price: 180 },
  { symbol: "PYPL", name: "PayPal", price: 65 },
  { symbol: "TSLA", name: "Tesla", price: 430 },
];

/** The earliest order date: when the 2016 app was made. */
const FIRST_DATE = new Date(2016, 7, 15);
/** How far an order's price strays from the stock's average cost, either way. */
const MAX_GAIN_LOSS = 0.2;
/** How far the previous close strays from the usual price, and the last trade from it. */
const VELOCITY = 0.05;

/** A random number from 0 up to 1, like Math.random. */
export type Random = () => number;

const between = (random: Random, low: number, high: number) => low + random() * (high - low);
const integerBetween = (random: Random, low: number, high: number) =>
  Math.round(between(random, low, high));
const cents = (amount: number) => Math.round(amount * 100) / 100;

/** A date as "YYYY-MM-DD" where you are. */
function localDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** A quote around a usual price: the previous close within 5% of it, the last trade within
 * 5% of the close. */
export function sampleQuote(price: number, random: Random = Math.random): StockQuote {
  const previousClose = cents(price * between(random, 1 - VELOCITY, 1 + VELOCITY));
  const lastTradePrice = cents(previousClose * between(random, 1 - VELOCITY, 1 + VELOCITY));
  return { previousClose, lastTradePrice };
}

/**
 * One to five filled orders, newest first, each later than the last and none after
 * today, priced within 20% of an average cost that's within 20% of the usual price. A
 * sell happens only with shares held, and uses up the oldest held shares first.
 */
export function sampleOrders(
  price: number,
  random: Random = Math.random,
  today: Date = new Date(),
): StockOrder[] {
  const count = integerBetween(random, 1, 5);
  const maxQuantity = Math.max(1, integerBetween(random, 1, 1200 / price));
  const averageCost = between(random, price * (1 - MAX_GAIN_LOSS), price * (1 + MAX_GAIN_LOSS));
  const orders: StockOrder[] = [];
  let held = 0;
  let after = FIRST_DATE.getTime();

  for (let i = 0; i < count; i++) {
    after = between(random, after, today.getTime());
    const type = ORDER_TYPES[Math.floor(random() * ORDER_TYPES.length)];
    const orderPrice = cents(
      between(random, averageCost * (1 - MAX_GAIN_LOSS), averageCost * (1 + MAX_GAIN_LOSS)),
    );
    const date = localDate(new Date(after));

    if (held > 0 && random() < 0.5) {
      const quantity = integerBetween(random, 1, Math.min(held, maxQuantity));
      held -= quantity;
      let toSell = quantity;
      for (const order of orders) {
        if (toSell === 0) break;
        const sold = Math.min(order.active, toSell);
        order.active -= sold;
        toSell -= sold;
      }
      orders.push({ date, side: "sell", type, price: orderPrice, quantity, active: 0 });
    } else {
      const quantity = integerBetween(random, 1, maxQuantity);
      held += quantity;
      orders.push({ date, side: "buy", type, price: orderPrice, quantity, active: quantity });
    }
  }
  return orders.reverse();
}

/** Every company, with its orders and a quote. */
export function sampleStocks(random: Random = Math.random, today: Date = new Date()): Stock[] {
  return COMPANIES.map(({ symbol, name, price }) => ({
    id: symbol,
    symbol,
    name,
    quote: sampleQuote(price, random),
    orders: sampleOrders(price, random, today),
  }));
}
