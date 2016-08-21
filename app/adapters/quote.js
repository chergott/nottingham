import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);
    hash.dataType = "jsonp";
    // hash.jsonp = '';
    return hash;
  },
  buildURL: function(modelName, id, snapshot, requestType, query) {
    let hasSymbolInQuery = !!query ? query.hasOwnProperty('symbol') : false;
    let hasSymbolInID = !!id ? (id.length >= 3 && id.length <= 5) : false;
    let isValid = hasSymbolInQuery || hasSymbolInID;
    // let isValid = (id.length >= 3 && id.length <= 5);
    if (!isValid) {
      console.error("No symbols provided in route. Please query an array of symbols.");
      return;
    }
    let symbol = hasSymbolInQuery ? query.symbol : id;
    let domain = 'https://query.yahooapis.com/';
    let namespace = 'v1/public/yql';
    let yqlSelect = '?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + symbol + '%22)';
    const extraQueryParams = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    let url = domain + namespace + yqlSelect + extraQueryParams;
    console.debug('Query URL: ', url);
    return url;
  },
  handleResponse: function(status, headers, payload) {
    let JSONAPIPayload = {
      data: {}
    };
    let quote = payload.query.results ? payload.query.results.quote : [];
    console.debug('Results (unmodified): ', quote);
    let data = {
      type: 'quote',
      id: quote.symbol,
      attributes: {}
    };
    //Dasherize
    Object.keys(quote).forEach((attribute) => {
      let dasherizedAttribute = attribute.dasherize();
      data.attributes[dasherizedAttribute] = quote[attribute];
    });
    JSONAPIPayload.data = data;
    console.debug('Results (REST): ', JSONAPIPayload);
    return JSONAPIPayload;
  }
});
