const glob = require("glob");
const { join } = require("path");

const { initializeBuiltInElements } = require("./initializeBuiltInElements");

const { addOrChange } = require("./common");

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.mock("./common", () => ({
  addOrChange: jest.fn(),
}));

describe("initializeBuiltInElements", () => {
  it("calls addOrChange for all components", async () => {
    glob.mockImplementationOnce((pattern, options, callback) => {
      callback(null, ["TestElement.se.html", "TestElement2.se.js"]);
    });

    await initializeBuiltInElements();

    expect(addOrChange).toHaveBeenCalledWith(
      join(__dirname, "builtInElements", "TestElement.se.html")
    );
    expect(addOrChange).toHaveBeenCalledWith(
      join(__dirname, "builtInElements", "TestElement2.se.js")
    );
  });
});
