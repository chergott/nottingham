import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('stock');
  }
/*
  setupController: function(controller, model) {
    this._super(controller, model);

    let symbols = model.getEach('symbol');
    this.store.query('quote', { symbols: symbols }).then( quotes => {
      controller.set('quotes', quotes);
    });
    controller.set('stocks', model);
  } */
});
