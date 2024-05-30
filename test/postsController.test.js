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

test('createSlug should increment slug by 1 when already exists', () => {
    const existingPosts = [
        { title: 'Test Post', slug: 'test-post' },
        { title: 'Test Post', slug: 'test-post-1' },
        { title: 'Test Post', slug: 'test-post-2' },
        { title: 'Test Post', slug: 'test-post-3' }
    ];

    const result = createSlug('Test Post', existingPosts);
    expect(result).toEqual('test-post-4');
});

test('createSlug should throw an error when title is missing', () => {
    expect(() => {
        createSlug(null, []);
    }).toThrow('Title is missing');
});

test('createSlug should throw an error when title is in incorrect format', () => {
    const invalidTitles = [123, {}, []];

    invalidTitles.forEach(title => {
        expect(() => {
            createSlug(title, []);
        }).toThrow('Title is not a string');
    });
});
