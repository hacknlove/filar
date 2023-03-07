const { getStaticContext } = require("./getStaticContext");
const { isAModule } = require('../common/isAModule');
const config = require("../config");

jest.mock('../common/isAModule');

jest.mock('../config', () => ({ }));

const filePath = '../../test/context.html';

describe('getStaticContext', () => {
    afterEach(() => {
        jest.clearAllMocks();
        delete config.context;
    });

    it('should return an object', async () => {
        expect(await getStaticContext(filePath)).toBeInstanceOf(Object);
    });

    it('should include filePath in the context', async () => {
        expect(await getStaticContext(filePath)).toHaveProperty('filePath', filePath);
    });

    it('should call the context function in config, passing filePath and config', async () => {
        config.context = jest.fn();

        await getStaticContext(filePath);

        expect(config.context).toHaveBeenCalledWith({ filePath, config });
    });

    it('should include the result of the context function in the context', async () => {
        config.context = jest.fn(() => ({ someData: true }));

        expect(await getStaticContext(filePath)).toHaveProperty('someData', true);
    });

    it('should include the context object in config in the context', async () => {
        config.context = { someData: true };

        expect(await getStaticContext(filePath)).toHaveProperty('someData', true);
    });

    it('should call the requiredContext function, passing filePath and config', async () => {
        isAModule.mockReturnValue(true);
        const mockRequiredContext = jest.fn(() => ({ someData: true }));
        jest.mock('../../test/context', () => mockRequiredContext, { virtual: true });

        await getStaticContext(filePath);

        expect(mockRequiredContext).toHaveBeenCalledWith({ filePath, config });
    });

    it('should include the result of the requiredContext function in the context', async () => {
        isAModule.mockReturnValue(true);
        const mockRequiredContext = jest.fn(() => ({ someData: true }));
        jest.mock('../../test/context', () => mockRequiredContext, { virtual: true });

        expect(await getStaticContext(filePath)).toHaveProperty('someData', true);
    });

    it('should include the requiredContext object in the context', async () => {
        isAModule.mockReturnValue(true);
        const mockRequiredContext = { someData: true };
        jest.mock('../../test/context', () => mockRequiredContext, { virtual: true });

        const context = await getStaticContext(filePath);

        expect(context).toHaveProperty('someData', true);
    });

    it('should assign requiredContext to context when it is not a function', async () => {
        const mockRequiredContext = { someOtherData: true };
        isAModule.mockReturnValue(true);
        jest.mock('../../test/context2', () => mockRequiredContext, { virtual: true });
        const context = await getStaticContext('../../test/context2.html');

        expect(context).toHaveProperty('someOtherData', true);
    });
});