const processCustomComponent = require('./processCustomComponent');
const { __test__ } = require('./customComponents');

describe('processCustomComponent', () => {
    it('should replace the component with the custom component', () => {
        __test__.customComponentsMap.set('test-component', 'test component content');
        document.body.innerHTML = '<test-component />'

        processCustomComponent.processCustomComponent(document.body.querySelector('test-component'));

        expect(document.body.innerHTML).toBe('test component content');
    });
});