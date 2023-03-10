const glob = require("glob");

const { initializeServerElements } = require("./initialize");

const { addOrChange } = require("./common");

const { initializeBuiltIn } = require("./builtIn/initializeBuiltIn");

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.mock("./common", () => ({
  addOrChange: jest.fn(),
}));

jest.mock("./builtIn/initializeBuiltIn");

jest.mock("../config", () => ({
  from: "test",
}));

describe("initializeServerElements", () => {
  it("calls addOrChange for all components", async () => {
    glob.mockImplementationOnce((pattern, options, callback) => {
      callback(null, ["TestElement.se.html", "TestElement2.se.html"]);
    });

    await initializeServerElements();

    expect(addOrChange).toHaveBeenCalledWith("test/TestElement.se.html");
    expect(addOrChange).toHaveBeenCalledWith("test/TestElement2.se.html");
    expect(initializeBuiltIn).toHaveBeenCalled();
  });
});
