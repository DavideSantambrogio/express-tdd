const { createSlug } = require('../controllers/postsController');

test('createSlug should return a string', () => {
    const result = createSlug('Test Post', []);
    expect(typeof result).toBe('string');
});
