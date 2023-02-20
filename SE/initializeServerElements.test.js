const glob = require("glob");

const { initializeServerElements } = require("./initializeServerElements");

const { addOrChange } = require("./common");

const { initializeBuiltIn } = require('./builtIn/initializeBuiltIn')

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.mock("./common", () => ({
  addOrChange: jest.fn(),
}));

jest.mock("./builtIn/initializeBuiltIn")

describe("initializeServerElements", () => {
  it("calls addOrChange for all components", async () => {
    glob.mockImplementationOnce((pattern, options, callback) => {
      callback(null, ["TestElement.se.html", "TestElement2.se.html"]);
    });

    await initializeServerElements({ from: "test" });

    expect(addOrChange).toHaveBeenCalledWith("test/TestElement.se.html");
    expect(addOrChange).toHaveBeenCalledWith("test/TestElement2.se.html");
    expect(initializeBuiltIn).toHaveBeenCalled();
  });
});
