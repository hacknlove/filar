const { resolvePath } = require('./resolvePath');

describe('resolvePath', () => {
    it('should return the correct path', () => {
        expect(resolvePath('/')).toBe(`${process.cwd()}/index.route.html`);
        expect(resolvePath('/about')).toBe(`${process.cwd()}/about.route.html`);
        expect(resolvePath('/about/')).toBe(`${process.cwd()}/about/index.route.html`);
    });
});