const { processNodeAttributes } = require("./processNodeAttributes");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("processNodeAttributes", () => {
  it("should replace placeholders in attributes", () => {
    const node = parser.parseFromString(
      "<div title={{Title}} width={{Height*16/9}}></div>"
    ).firstChild;

    processNodeAttributes(node, { Title: "My title", Height: 1080 });

    expect(node.toString()).toMatchSnapshot();
  });
});
