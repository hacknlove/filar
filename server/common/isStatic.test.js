const { isStatic } = require("./isStatic");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("isStatic", () => {
  test("should return true for a static file path", () => {
    const filePath = "/path/to/file";
    const doc = parser.parseFromString("<html></html>");
    expect(isStatic(filePath, doc)).toBe(true);
  });

  test("should return false for a file path with dynamic segments", () => {
    const filePath = "/path/[dynamic]/file";
    const doc = parser.parseFromString("<html></html>");
    expect(isStatic(filePath, doc)).toBe(false);
  });

  test("should return false if SSR elements are found in the document", () => {
    const filePath = "/path/to/file";
    const doc = parser.parseFromString("<html><SSR><div></div></SSR></html>");
    expect(isStatic(filePath, doc)).toBe(false);
  });

  test("should return false if Directive elements are found in the document", () => {
    const filePath = "/path/to/file";
    const doc = parser.parseFromString(
      "<html><Directive><div></div></Directive></html>"
    );
    expect(isStatic(filePath, doc)).toBe(false);
  });
});
