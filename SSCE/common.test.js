const { readFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));

const {
  customElements,
  addOrChange,
  remove,
  customElementsMap,
} = require("./common");

describe("customElements", () => {
  it("returns a warning if the element does not exist", () => {
    expect(customElements["WrongElement"].toString()).toBe(
      "<!--WrongElement does not exists-->"
    );
  });
  it("returns a warning if the element is not a custom element", () => {
    customElementsMap.set("WrongElement", {});

    expect(customElements["WrongElement"].toString()).toBe(
      "<!--WrongElement is not a valid custom element-->"
    );
  });
});

describe("addOrChange", () => {
  it("should add a new element", async () => {
    readFile.mockImplementationOnce(() => "test element content");

    await addOrChange("TestElement.se.html");

    expect(customElements["TestElement"]).toMatchSnapshot();
  });

  it("warns if element name does not match the convention", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await addOrChange("testElement.html");

    expect(warnSpy).toHaveBeenCalledWith(
      "File testElement.html does not match the element naming convention"
    );
  });

  it("adds js elements", async () => {
    const jsElement = require("./test/TestJsElement.se.js");

    await addOrChange("./test/TestJsElement.se.js");

    expect(customElements["TestJsElement"]).toBe(jsElement);
  });
});

describe("remove", () => {
  it("should remove a element", async () => {
    customElementsMap.set("TestElement", "test element content");

    await remove("TestElement.se.html");

    expect(customElements["TestElement"].toString()).toBe(
      "<!--TestElement does not exists-->"
    );
  });

  it("warns if element name does not match the convention", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await remove("testElement.html");

    expect(warnSpy).toHaveBeenCalledWith(
      "File testElement.html does not match the element naming convention"
    );
  });
});
