
const Model = require('../models/model');

test('Model should be a class', () => {
    const model = new Model();
    expect(model).toBeInstanceOf(Model);
});
