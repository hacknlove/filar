const { loadPage, getPage } = require('./pages');
const { readFile } = require('fs-extra');

jest.mock('fs-extra', () => ({
    readFile: jest.fn(() => Promise.resolve()),
}));

describe('getPage', () => {
    test('should throw an error if the page is not found', async () => {
        await expect(() => getPage('/path/to/nonexistent/page.html')).rejects.toThrow('Page not found');
    });

    test('should return a cloned node if the page exists', async () => {
        readFile.mockResolvedValueOnce('<html><body>Hello World!</body></html>');
        const filePath = '/path/to/existing/page.html';
        await loadPage(filePath);
        const clonedNode = await getPage(filePath);
        expect(clonedNode.toString()).toMatchSnapshot();
    });
});