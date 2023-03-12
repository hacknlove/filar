const { getNewContext } = require("./getNewContext");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("getNewContext", () => {
  it("should return the context with the new attributes", () => {
    const node = parser.parseFromString(
      `<div Title="'new title'" FooBar=('bar')></div>`
    ).firstChild;

    const context = {
      Title: "old title",
    };

    const newContext = getNewContext(node, context);

    expect(newContext).toEqual({
      Title: "new title",
      FooBar: "bar",
    });
  });

  it("takes the value from the context if the value is a key", () => {
    const node = parser.parseFromString(
      "<div NewField=Content></div>"
    ).firstChild;

    const context = {
      Content: ["some array"],
    };

    const newContext = getNewContext(node, context);

    expect(newContext.NewField).toBe(newContext.Content);
    expect(newContext.NewField).toEqual(["some array"]);
  });

  it("takes the value from the context if the value is an expression", () => {
    const node = parser.parseFromString(
      "<div NewField=Content[0]></div>"
    ).firstChild;

    const context = {
      Content: ["some array"],
    };

    const newContext = getNewContext(node, context);

    expect(newContext.NewField).toBe(newContext.Content[0]);
    expect(newContext.NewField).toBe("some array");
  });

  it("throws if the expresion is wrong", () => {
    const node = parser.parseFromString(
      "<div NewField=Foo+Bar=FooBar></div>"
    ).firstChild;

    const context = {
      Content: ["some array"],
    };

    expect(() => getNewContext(node, context)).toThrow();
  });
});
