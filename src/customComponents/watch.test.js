const { addOrChange, remove } = require("./common");
const { __chokidarWatcher } = require('chokidar');
const { watchCustomComponents } = require('./watch');

jest.mock('chokidar', () => {
    const __chokidarWatcher = {
        on: jest.fn(),
    }

    return {
        __chokidarWatcher,
        watch: jest.fn(() => __chokidarWatcher),
    }
});

describe('watchCustomComponents', () => {
    it('should watch for changes', () => {

        watchCustomComponents();

        expect(__chokidarWatcher.on).toHaveBeenCalledWith('add', addOrChange);
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('change', addOrChange);
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('unlink', remove);
    });
});