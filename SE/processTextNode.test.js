const { processTextNode } = require("./processTextNode");

describe("processTextNode", () => {
  it("should replace placeholders", () => {
    const node = {
      textContent: "Hello, {{Name}}!",
    };
    const context = {
      Name: "John",
    };
    processTextNode(node, context);
    expect(node.textContent).toBe("Hello, John!");
  });
});
