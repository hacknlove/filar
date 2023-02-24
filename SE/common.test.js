const { readFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
}));

const {
  ServerElements,
  addOrChange,
  remove,
  ServerElementsMap,
} = require("./common");

describe("ServerElements", () => {
  it("returns a warning if the element does not exist", () => {
    expect(ServerElements["WrongElement"].toString()).toBe(
      "<!--WrongElement does not exists-->"
    );
  });
  it("returns a warning if the element is not a custom element", () => {
    ServerElementsMap.set("WrongElement", {});

    expect(ServerElements["WrongElement"].toString()).toBe(
      "<!--WrongElement is not a valid custom element-->"
    );
  });
});

describe("addOrChange", () => {
  it("should add a new element", async () => {
    readFile.mockImplementationOnce(() => "test element content");

    await addOrChange("TestElement.se.html");

    expect(ServerElements["TestElement"]).toMatchSnapshot();
  });

  it("throws if element name does not match the convention", async () => {
    await expect(() => addOrChange("testElement.html")).rejects.toThrow();
  });

  it("adds js elements", async () => {
    const jsElement = require("./test/TestJsElement.se.js");

    await addOrChange("./test/TestJsElement.se.js");

    expect(ServerElements["TestJsElement"]).toBe(jsElement);
  });
});

describe("remove", () => {
  it("should remove a element", async () => {
    ServerElementsMap.set("TestElement", "test element content");

    await remove("TestElement.se.html");

    expect(ServerElements["TestElement"].toString()).toBe(
      "<!--TestElement does not exists-->"
    );
  });

  it("throws if element name does not match the convention", async () => {
    expect(() => remove("testElement.html")).toThrow();
  });
});
