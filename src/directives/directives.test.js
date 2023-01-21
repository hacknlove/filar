const { directives, initializeDirectives } = require('./directives');

describe('directives', () => {
    it('has a directives object', () => {
        expect(directives).toEqual({});
    });

    it('initializes', async () => {
        await initializeDirectives();
        expect(directives.status).toBeDefined();
    })
});
