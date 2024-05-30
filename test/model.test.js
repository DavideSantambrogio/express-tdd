
const Model = require('../models/model');

test('Model should be a class', () => {
    const model = new Model();
    expect(model).toBeInstanceOf(Model);
});

test('Instance of model should require JSON file name during instantiation', () => {
    const fileName = 'data.json';
    const model = new Model(fileName);
    expect(model.fileName).toBe(fileName);
});


test('Instance of model should have a read method', () => {
    const model = new Model('data.json');
    expect(typeof model.read).toBe('function');
});
