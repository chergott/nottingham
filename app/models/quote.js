import DS from 'ember-data';

export default DS.Model.extend({
  ask: DS.attr('number'),
  averageDailyVolume: DS.attr('number'),
  bid: DS.attr('number'),
  bookValue: DS.attr('number'),
  change: DS.attr('number'),
  changeFromFiftydayMovingAverage: DS.attr('number'),
  changeFromTwoHundreddayMovingAverage: DS.attr('number'),
  changeFromYearHigh: DS.attr('number'),
  changeFromYearLow: DS.attr('number'),
  changePercentChange: DS.attr('string'),
  changeinPercent: DS.attr('number'),
  currency: DS.attr('string'),
  daysHigh: DS.attr('number'),
  daysLow: DS.attr('number'),
  daysRange: DS.attr('number'),
  dividendPayDate: DS.attr('date'),
  dividendShare: DS.attr('number'),
  dividendYield: DS.attr('number'),
  earningsShare: DS.attr('number'),
  ebitda: DS.attr('string'),
  epsestimateCurrentYear: DS.attr('number'),
  epsEstimateNextQuarter: DS.attr('number'),
  epsEstimateNextYear: DS.attr('number'),
  exDividendDate: DS.attr('date'),
  fiftydayMovingAverage: DS.attr('number'),
  name: DS.attr('string'),
  oneyrTargetPrice: DS.attr('number'),
  open: DS.attr('number'),
  shortRatio: DS.attr('number'),
  stockExchange: DS.attr('string'),
  symbol: DS.attr('string'),
  twoHundreddayMovingAverage: DS.attr('number'),
  volume: DS.attr('number'),
  yearHigh: DS.attr('number'),
  yearLow: DS.attr('number'),
  yearRange: DS.attr('string')
});
