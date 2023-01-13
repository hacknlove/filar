const { resolvePath } = require('./resolvePath');

describe('resolvePath', () => {
    it('should return the correct path', () => {
        expect(resolvePath('/')).toBe('/index.html');
        expect(resolvePath('/about')).toBe('/about.html');
        expect(resolvePath('/about/')).toBe('/about/index.html');
    });
});