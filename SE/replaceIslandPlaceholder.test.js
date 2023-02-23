const { replaceIslandPlaceholders } = require("./replaceIslandPlaceholders");

describe("replaceIslandPlaceholders", () => {
  it("replaces placeholders with island values", () => {
    const text = "Hello {(name)}!";

    const island = {
      name: "world",
    };

    const result = replaceIslandPlaceholders({
      text,
      island,
      childNumber: 0,
    });

    expect(result.text).toBe("Hello world!");
    expect(result.serialized).toEqual([[0, 6, 5, "name"]]);
  });

  it("throws an error if the expression is invalid", () => {
    const text = "Hello {(wrong expresion)}!";

    const island = {
      name: "world",
    };

    expect(() =>
      replaceIslandPlaceholders({
        text,
        island,
        childNumber: 0,
      })
    ).toThrow("Error while evaluating island");
  });
});
