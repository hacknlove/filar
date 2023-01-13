const { resolvePath } = require('./resolvePath');

describe('resolvePath', () => {
    it('should return the correct path', () => {
        expect(resolvePath('/')).toBe(`${process.cwd()}/route.index.html`);
        expect(resolvePath('/about')).toBe(`${process.cwd()}/route.about.html`);
        expect(resolvePath('/about/')).toBe(`${process.cwd()}/route.about/index.html`);
    });
});