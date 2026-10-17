import { describe, expect, it } from "vitest";
import {
  extendStock,
  gainSign,
  signedDollars,
  signedPercent,
  summarize,
  toNiceNumber,
  type Stock,
} from "./stocks";

const stock: Stock = {
  id: "ACME",
  symbol: "ACME",
  name: "Acme",
  quote: { previousClose: 100, lastTradePrice: 110 },
  orders: [
    // 10 bought at $90, then 4 of them sold, then 5 more bought at $80.
    { date: "2020-03-01", side: "buy", type: "Market", price: 80, quantity: 5, active: 5 },
    { date: "2019-02-01", side: "sell", type: "Limit", price: 95, quantity: 4, active: 0 },
    { date: "2018-01-01", side: "buy", type: "Market", price: 90, quantity: 10, active: 6 },
  ],
};

describe("extendStock", () => {
  it("values the shares still held", () => {
    const extended = extendStock(stock);
    expect(extended.activeQuantity).toBe(11);
    expect(extended.activeValue).toBe(1210);
    expect(extended.activeCost).toBe(6 * 90 + 5 * 80);
  });

  it("measures the day from the previous close and the total from what was paid", () => {
    const extended = extendStock(stock);
    expect(extended.dayChange).toBe(10);
    expect(extended.dayPercentChange).toBe(10);
    expect(extended.activeDayGainLoss).toBe(110);
    expect(extended.activeTotalGainLoss).toBe(1210 - 940);
    expect(extended.isDayUp).toBe(true);
  });

  it("has no total percent when nothing is held", () => {
    const soldOut = extendStock({ ...stock, orders: [] });
    expect(soldOut.activeValue).toBe(0);
    expect(soldOut.totalPercentChange).toBe(0);
  });
});

describe("summarize", () => {
  const rows = [extendStock(stock)];

  it("totals the day's gain against the value at the previous close", () => {
    expect(summarize(rows, "day")).toEqual({
      totalActiveValue: 1210,
      gainLoss: 110,
      performance: 10,
    });
  });

  it("totals all gains against what the shares cost", () => {
    const all = summarize(rows, "all");
    expect(all.gainLoss).toBe(270);
    expect(all.performance).toBeCloseTo((270 / 940) * 100);
  });

  it("is zero for an empty portfolio", () => {
    expect(summarize([], "day")).toEqual({ totalActiveValue: 0, gainLoss: 0, performance: 0 });
  });
});

describe("formatting", () => {
  it("formats like react-app's toNiceNumber", () => {
    expect(toNiceNumber(1234567.891)).toBe("1,234,567.89");
    expect(toNiceNumber(-80)).toBe("80.00");
  });

  it("tells gains from losses once rounded to cents", () => {
    expect(gainSign(12.5)).toBe(1);
    expect(gainSign(-0.01)).toBe(-1);
    expect(gainSign(-0.004)).toBe(0);
    expect(gainSign(0)).toBe(0);
  });

  it("signs dollars and percents, but not zero", () => {
    expect(signedDollars(1234.5)).toBe("+$1,234.50");
    expect(signedDollars(-80)).toBe("-$80.00");
    expect(signedDollars(-0.004)).toBe("$0.00");
    expect(signedPercent(3.254)).toBe("+3.25%");
    expect(signedPercent(-1.1)).toBe("-1.10%");
    expect(signedPercent(0)).toBe("0.00%");
  });
});
