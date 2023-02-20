const glob = require("glob");
const { join } = require("path");

const { initializeBuiltIn } = require("./initializeBuiltIn");

const { addOrChange } = require("../common");

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.mock("../common", () => ({
  addOrChange: jest.fn(),
}));

describe("initializeBuiltIn", () => {
  it("calls addOrChange for all components", async () => {
    glob.mockImplementationOnce((pattern, options, callback) => {
      callback(null, ["TestElement.se.html", "TestElement2.se.js"]);
    });

    await initializeBuiltIn();

    expect(addOrChange).toHaveBeenCalledWith(
      join(__dirname, "TestElement.se.html")
    );
    expect(addOrChange).toHaveBeenCalledWith(
      join(__dirname, "TestElement2.se.js")
    );
  });
});
