const glob = require("glob");
const { readFile } = require("fs-extra");

const {
  initializeCustomComponents,
  customComponents,
} = require("./customComponents");

jest.mock("glob", () => jest.fn());
jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));
jest.spyOn(console, "warn").mockImplementation(() => {});

describe("initializeCustomComponents", () => {
  it("should load all components", async () => {
    glob.mockImplementationOnce((pattern, callback) => {
      callback(null, ["test-component.component.html"]);
    });
    readFile.mockImplementationOnce(() => "test-component");

    await initializeCustomComponents();

    expect(customComponents["test-component"]).toBe("test-component");
  });

  it("should warn if component name does not match the convention", async () => {
    glob.mockImplementationOnce((pattern, callback) => {
      callback(null, ["testComponent.html"]);
    });

    await initializeCustomComponents();

    expect(console.warn).toHaveBeenCalledWith(
      "File testComponent.html does not match the component naming convention"
    );
  });
});

describe("customComponents", () => {
  it("should return a warning if the component does not exist", () => {
    expect(customComponents["wrong-component"]).toBe(
      "<!-- wrong-component does not exists -->"
    );
  });
});
