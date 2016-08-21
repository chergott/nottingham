import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    removeStock: function(stock) {
      let confirmation = confirm('Are you sure?');
      if (confirmation) {
        stock.destroyRecord();
      }
    }
  }
});
