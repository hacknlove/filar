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

describe('watchCustomElements', () => {
    it('should watch for changes', () => {

        watchCustomElements();

        expect(__chokidarWatcher.on).toHaveBeenCalledWith('add', addOrChange);
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('change', addOrChange);
        expect(__chokidarWatcher.on).toHaveBeenCalledWith('unlink', remove);
    });
});