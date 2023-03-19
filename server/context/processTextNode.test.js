const { DOMParser } = require("linkedom");
const parser = new DOMParser();

const { processTextNode, __test__ } = require("./processTextNode");

describe("processTextNode", () => {
  it("replaces statics placeholders", () => {
    const node = {
      textContent: "Hello, {{Name}}!",
    };
    const context = {
      Name: "John",
      __islands: {},
    };
    processTextNode(node, context);
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

    processTextNode(textNode, {
      __islands: {
        island: {
          state: { foo: "Hola" },
          expressions: {},
          offsets: {},
        },
      },
    });

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

    processTextNode(textNode, {
      __islands: {
        island: {
          state: { foo: "Hola" },
          expressions: {},
          offsets: {},
        },
      },
    });

    expect(document.toString()).toMatchSnapshot();
  });
});

describe("getTextChildNumber", () => {
  it("counts the number of previous siblings", () => {
    const ul = parser.parseFromString(`
      <ul>
        CERO
        <br />
        UNO
        <br />
        DOS
      </ul>
    `).firstElementChild;

    const CERO = ul.childNodes[0];
    const UNO = ul.childNodes[2];
    const DOS = ul.childNodes[4];

    expect(__test__.getTextChildNumber(CERO)).toBe(0);
    expect(__test__.getTextChildNumber(UNO)).toBe(1);
    expect(__test__.getTextChildNumber(DOS)).toBe(2);
  });
});

describe("findIsland", () => {
  it("returns the closest up island", () => {
    const document = parser.parseFromString(`
      <div id="root">
        <div id="the-island">
          <div>
            <div id="element" />
          </div>
        </div>
      </div>
    `);

    const element = document.getElementById("element");

    expect(
      __test__.findIsland(element, {
        __islands: {
          "the-island": { island: "the island" },
        },
      })
    ).toEqual({
      island: "the island",
    });
  });
});
