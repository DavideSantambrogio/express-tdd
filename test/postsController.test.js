const { createSlug } = require('../controllers/postsController');

test('createSlug should return a string', () => {
    const result = createSlug('Test Post', []);
    expect(typeof result).toBe('string');
});

test('createSlug should return a lowercase string', () => {
    const result = createSlug('Test Post', []);
    expect(result).toEqual(expect.stringMatching(/[a-z]/));    
});

test('createSlug should return a string with spaces replaced by -', () => {
    const result = createSlug('Test Post', []);
    expect(result).toEqual('test-post');
});
