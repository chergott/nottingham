import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    // let symbols = ['AAPL', 'GOOGL', 'AMZN'];
    return this.store.findAll('stock');
    /*.then( (stocks) => {
      let symbols = [];
      stocks.forEach( (stock) => {
        symbols.push(stock.symbol);
      });
      return RSVP.hash({
        stocks: stocks,
        quotes: this.store.query('quote', { symbols: symbols })
      });
    });*/
}});
