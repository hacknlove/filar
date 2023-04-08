const { DOMParser } = require("linkedom");
const parser = new DOMParser();
const { createFakeContext } = require("../../test/fakeContext");

const { processTextNode } = require("./processTextNode");

describe("processTextNode", () => {
  it("replaces statics placeholders", () => {
    const node = {
      textContent: "Hello, {{Name}}!",
    };
    processTextNode(
      node,
      createFakeContext({
        Name: "John",
      })
    );
    expect(node.textContent).toBe("Hello, John!");
  });

  it("replaces island placeholders", () => {
    const document = parser.parseFromString(`
      <div id=island>
        <span id=span>
          {(foo)}
        </span>
      </div>
    `);

    const span = document.getElementById("span");
    const textNode = span.firstChild;

    processTextNode(
      textNode,
      createFakeContext({
        __islands: {
          island: {
            state: { foo: "Hola" },
            expressions: {},
            offsets: {},
          },
        },
      })
    );

    expect(document).toMatchSnapshot();
  });

  it("inside island without replacement", () => {
    const document = parser.parseFromString(`
      <div id=island>
        <span id=span>
          No replacements
        </span>
      </div>
    `);

    const island = document.getElementById("island");
    const span = document.getElementById("span");
    const textNode = span.firstChild;

    island.island = { foo: "Hola" };

    processTextNode(
      textNode,
      createFakeContext({
        __islands: {
          island: {
            state: { foo: "Hola" },
            expressions: {},
            offsets: {},
          },
        },
      })
    );

    expect(document.toString()).toMatchSnapshot();
  });
});
