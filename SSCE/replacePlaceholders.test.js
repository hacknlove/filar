const { replacePlaceholders } = require("./replacePlaceholders");
describe("replacePlaceholders", () => {
  it("should replace placeholders", () => {
    const text = "Hello, {{Name}}!";
    const context = {
      Name: "John",
    };
    expect(replacePlaceholders(text, context)).toBe("Hello, John!");
  });
});
