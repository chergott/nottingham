import FirebaseSerializer from 'emberfire/serializers/firebase';
export default FirebaseSerializer.extend({
  keyForRelationship: function(key, relationship, method) {
    // key = 'symbol';
    return key;
  }
});
