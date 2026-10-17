import { describe, expect, it } from "vitest";
import { sampleOrders, sampleStocks } from "./sampleData";

describe("sample data", () => {
  it("makes up different quotes and holdings each time", () => {
    expect(sampleStocks()).not.toEqual(sampleStocks());
  });

  it("makes one to five orders, newest first, none before 2016 or in the future", () => {
    const today = new Date(2026, 9, 7);
    for (let run = 0; run < 200; run++) {
      const orders = sampleOrders(48, Math.random, today);
      expect(orders.length).toBeGreaterThanOrEqual(1);
      expect(orders.length).toBeLessThanOrEqual(5);
      const dates = orders.map((order) => order.date);
      expect([...dates].sort().reverse()).toEqual(dates);
      expect(dates.every((date) => date >= "2016-08-15" && date <= "2026-10-07")).toBe(true);
      expect(orders.every((order) => order.price > 0 && order.quantity > 0)).toBe(true);
    }
  });

  it("never sells more than is held, and holds what was bought less what was sold", () => {
    for (let run = 0; run < 200; run++) {
      const oldestFirst = sampleOrders(130).reverse();
      let held = 0;
      for (const order of oldestFirst) {
        held += order.side === "buy" ? order.quantity : -order.quantity;
        expect(held).toBeGreaterThanOrEqual(0);
        expect(order.active).toBeGreaterThanOrEqual(0);
        expect(order.active).toBeLessThanOrEqual(order.side === "buy" ? order.quantity : 0);
      }
      const active = oldestFirst.reduce((sum, order) => sum + order.active, 0);
      expect(active).toBe(held);
    }
  });

  it("starts with a buy", () => {
    for (let run = 0; run < 100; run++) {
      expect(sampleOrders(90).at(-1)!.side).toBe("buy");
    }
  });

  it("quotes every company once, the last trade within 5% of the close", () => {
    const stocks = sampleStocks();
    expect(new Set(stocks.map((stock) => stock.symbol)).size).toBe(stocks.length);
    expect(stocks.map((stock) => stock.symbol)).toContain("NVDA");
    for (const stock of stocks) {
      const { previousClose, lastTradePrice } = stock.quote;
      expect(lastTradePrice / previousClose).toBeGreaterThan(0.94);
      expect(lastTradePrice / previousClose).toBeLessThan(1.06);
    }
  });
});
