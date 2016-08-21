import { moduleForModel, test } from 'ember-qunit';

moduleForModel('markit', 'Unit | Serializer | markit', {
  // Specify the other units that are required for this test.
  needs: ['serializer:markit']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
