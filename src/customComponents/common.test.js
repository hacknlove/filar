const { readFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));

const {
  customComponents,
  addOrChange,
  remove,
  customComponentsMap,
} = require("./common");

describe("customComponents", () => {
  it("should return a warning if the component does not exist", () => {
    expect(customComponents["wrong-component"]).toBe(
      "<!-- wrong-component does not exists -->"
    );
  });
});

describe("addOrChange", () => {
  it("should add a new component", async () => {
    readFile.mockImplementationOnce(() => "test component content");

    await addOrChange("test-component.component.html");

    expect(customComponents["test-component"]).toBe("test component content");
  });

  it('warns if component name does not match the convention', async () => {
    const warnSpy = jest.spyOn(console, 'warn');

    await addOrChange("testComponent.html");

    expect(warnSpy).toHaveBeenCalledWith(
      "File testComponent.html does not match the component naming convention"
    );
  });
});

describe("remove", () => {
  it("should remove a component", async () => {
    customComponentsMap.set("test-component", "test component content");

    await remove("test-component.component.html");

    expect(customComponents["test-component"]).toBe(
      "<!-- test-component does not exists -->"
    );
  });

  it('warns if component name does not match the convention', async () => {
    const warnSpy = jest.spyOn(console, 'warn');

    await remove("testComponent.html");

    expect(warnSpy).toHaveBeenCalledWith(
      "File testComponent.html does not match the component naming convention"
    );
  });
});

/* jest.mock("glob", () => jest.fn());
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


 */