const { addOrChange, remove } = require("./common");
const { __chokidarWatcher } = require('chokidar');
const { watchCustomElements } = require('./watch');

jest.mock('chokidar', () => {
    const __chokidarWatcher = {
        on: jest.fn(),
    }

    return {
        __chokidarWatcher,
        watch: jest.fn(() => __chokidarWatcher),
    }
});

jest.mock('./common', () => ({
    addOrChange: jest.fn(),
    remove: jest.fn(),
}));

describe('watchCustomElements', () => {
    it('should watch for changes', async () => {

        const buildAll = jest.fn();

        watchCustomElements({ from: 'from', to: 'to', buildAll });

        expect(__chokidarWatcher.on).toHaveBeenCalledTimes(3);

        expect(__chokidarWatcher.on).toHaveBeenCalledWith('add', expect.any(Function));
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('unlink', expect.any(Function));

        const [add, change, unlink] = __chokidarWatcher.on.mock.calls.map(call => call[1]);

        await add('file');
        expect(addOrChange).toHaveBeenCalledWith('from/file');
        expect(buildAll).toHaveBeenCalledWith({ from: 'from', to: 'to' });
        buildAll.mockClear();

        await change('file');
        expect(addOrChange).toHaveBeenCalledWith('from/file');
        expect(buildAll).toHaveBeenCalledWith({ from: 'from', to: 'to' });
        buildAll.mockClear();

        await unlink('file');
        expect(remove).toHaveBeenCalledWith('from/file');
        expect(buildAll).toHaveBeenCalledWith({ from: 'from', to: 'to' });
    });
});