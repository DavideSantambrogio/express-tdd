
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


test('add should add new data to the file and return updated data array', () => {
    // Arrange
    const model = new Model('test-data.json');
    const newData = { id: 1, name: 'New Data' };
    
    // Act
    const result = model.add(newData);
    
    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result).toContainEqual(newData);
});
