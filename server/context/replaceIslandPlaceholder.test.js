const { replaceIslandPlaceholders } = require("./replaceIslandPlaceholders");

const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("replaceIslandPlaceholders", () => {
  it("replaces placeholders with island values", () => {
    const text = "Hello {(name)}!";

    const span = parser.parseFromString(
      `<span>${text}</span>`
    ).firstElementChild;

    const island = {
      name: "world",
    };

    replaceIslandPlaceholders({
      node: span.firstChild,
      text,
      island: {
        state: island,
        expressions: {},
        offsets: {},
      },
      attribute: "t-0",
      childNumber: 0,
    });

    expect(span.toString()).toBe('<span id="n-0">Hello world!</span>');
  });

  it("throws an error if the expression is invalid", () => {
    const text = "Hello {(wrong expression)}!";

    const span = parser.parseFromString(
      `<span>${text}</span>`
    ).firstElementChild;

    const island = {
      name: "world",
    };

    expect(() =>
      replaceIslandPlaceholders({
        node: span.firstChild,
        text,
        island: {
          state: island,
          expressions: {},
          offsets: {},
        },
        attribute: "t-0",
        childNumber: 0,
      })
    ).toThrow("Error while evaluating island");
  });
});
