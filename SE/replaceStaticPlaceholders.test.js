const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");
describe("replaceStaticPlaceholders", () => {
  it("should replace placeholders", () => {
    const text = "Hello, {{Name}}!";
    const context = {
      Name: "John",
    };
    expect(replaceStaticPlaceholders({ text, context })).toBe("Hello, John!");
  });
});
