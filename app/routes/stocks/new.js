import Ember from 'ember';


export default Ember.Route.extend({
  model() {
    return this.store.createRecord('stock');
  },

  actions: {

    addStock(newStock) {
      let _this = this;
      let symbol = newStock.get('symbol');
      this.store.queryRecord('quote', {
        symbol: symbol
      }).then(function(quote) {
        newStock.set('quote', quote);
        newStock.save().then(() => _this.transitionTo('stocks.index'));
      });
    },

    willTransition() {
      // rollbackAttributes() removes the record from the store
      // if the model 'isNew'
      this.controller.get('model').rollbackAttributes();
    }
  }
});
