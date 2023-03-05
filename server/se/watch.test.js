const { addOrChange, remove } = require("./common");
const { __chokidarWatcher } = require("chokidar");
const { watchServerElements } = require("./watch");

jest.mock("chokidar", () => {
  const __chokidarWatcher = {
    on: jest.fn(),
  };

  return {
    __chokidarWatcher,
    watch: jest.fn(() => __chokidarWatcher),
  };
});

jest.mock("./common", () => ({
  addOrChange: jest.fn(() => Promise.resolve("addOrChange promise")),
  remove: jest.fn(() => Promise.resolve("remove promise")),
}));

jest.mock("../config", () => ({
  from: "from",
}));

describe("watchServerElements", () => {
  it("should watch for changes", async () => {
    const cb = jest.fn();

    watchServerElements(cb);

    expect(__chokidarWatcher.on).toHaveBeenCalledTimes(3);

    expect(__chokidarWatcher.on).toHaveBeenCalledWith(
      "add",
      expect.any(Function)
    );
    expect(__chokidarWatcher.on).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(__chokidarWatcher.on).toHaveBeenCalledWith(
      "unlink",
      expect.any(Function)
    );

    const [add, change, unlink] = __chokidarWatcher.on.mock.calls.map(
      (call) => call[1]
    );

    await add("file");
    expect(addOrChange).toHaveBeenCalledWith("from/file");
    expect(cb).toHaveBeenCalledWith("addOrChange promise");
    cb.mockClear();

    await change("file");
    expect(addOrChange).toHaveBeenCalledWith("from/file");
    expect(cb).toHaveBeenCalledWith("addOrChange promise");
    cb.mockClear();

    await unlink("file");
    expect(remove).toHaveBeenCalledWith("from/file");
    expect(cb).toHaveBeenCalledWith("remove promise");
  });
});
