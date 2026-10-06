import { describe, expect, it } from "vitest";
import { formatDollars, formatPercent, orderReturns, type Quote, type StockOrder } from "./portfolio";

const quote: Quote = { symbol: "ACME", name: "Acme", open: 100, ask: 110 };
const order: StockOrder = {
  id: "1",
  symbol: "ACME",
  method: "buy",
  type: "market",
  price: 80,
  quantity: 10,
  date: "2016-08-01",
};

describe("orderReturns", () => {
  it("measures a buy from today's open and from the order price", () => {
    expect(orderReturns(order, quote)).toEqual({ today: 100, total: 300, totalPercent: 37.5 });
  });

  it("runs the other way for a sell", () => {
    expect(orderReturns({ ...order, method: "sell" }, quote)).toEqual({
      today: -100,
      total: -300,
      totalPercent: -37.5,
    });
  });

  it("shows a loss as negative", () => {
    const fell = orderReturns(order, { ...quote, ask: 60 });
    expect(fell.total).toBe(-200);
    expect(fell.totalPercent).toBe(-25);
  });
});

describe("formatting", () => {
  it("formats dollars and percents with signs", () => {
    expect(formatDollars(1234.5)).toBe("$1,234.50");
    expect(formatDollars(-80)).toBe("−$80.00");
    expect(formatPercent(3.254)).toBe("+3.25%");
    expect(formatPercent(-1.1)).toBe("−1.10%");
    expect(formatPercent(0)).toBe("0.00%");
  });
});
