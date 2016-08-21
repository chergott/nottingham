import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  symbol: DS.attr('string'),
  quote: DS.belongsTo('quote', {
    async: true
  }),
  quantity: DS.attr('number'),
  price: DS.attr('number'),
  method: DS.attr('string', {
    defaultValue: 'buy'
  }),
  type: DS.attr('string', {
    defaultValue: 'market'
  }),
  date: DS.attr('string'),
  todaysReturn: Ember.computed('quote.open', 'quantity', 'quote.ask', function() {
    let todaysReturn = parseFloat(this.get('quantity') * (this.get('quote.ask') - this.get('quote.open')), 10);
    return todaysReturn.toFixed(2);
  }),
  todaysReturnF: Ember.computed('todaysReturn', function() {
    return '$' + this.get('todaysReturn');
  }),
  isPositiveToday: Ember.computed.gt('todaysReturn', 0),
  totalReturn: Ember.computed('price', 'quantity', 'quote.ask', function() {
    let totalReturn = parseFloat(this.get('quantity') * (this.get('quote.ask') - this.get('price')), 10);
    return totalReturn.toFixed(2);
  }),
  totalReturnP: Ember.computed('price', 'quote.ask', function() {
    let percentChange = parseFloat(this.get('quote.ask') / (this.get('price')), 10);
    percentChange = percentChange < 1 ? percentChange - 1 : percentChange;
    return percentChange.toFixed(2) + '%';
  }),
  totalReturnF: Ember.computed('totalReturn', 'totalReturnP', function() {
    return '$' + this.get('totalReturn') + '\t(' + this.get('totalReturnP') +')';
  }),
  isPositiveTotal: Ember.computed.gt('totalReturn', 0)
});
