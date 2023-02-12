const glob = require("glob");

const {
  initializeCustomElements,
} = require("./initializeCustomElements");

const { addOrChange } = require("./common");

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.mock("./common", () => ({
  addOrChange: jest.fn(),
}));

describe("initializecustomElements", () => {
  it("calls addOrChange for all components", async () => {
    glob.mockImplementationOnce((pattern, options, callback) => {
      callback(null, ["TestElement.se.html", "TestElement2.se.html"]);
    });

    await initializeCustomElements({ from: 'test' });
    
    expect(addOrChange).toHaveBeenCalledWith("test/TestElement.se.html");
    expect(addOrChange).toHaveBeenCalledWith("test/TestElement2.se.html");
  });
});
