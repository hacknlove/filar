const {
  replaceIslandPlaceholders,
  findIsland,
  getTextChildNumber,
} = require("./replaceIslandPlaceholders");

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
      context: {
        Indexes: {
          currentNodeId: 0,
        },
      },
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
        context: {
          Indexes: {
            currentNodeId: 0,
          },
        },
      })
    ).toThrow("Error while evaluating island");
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

    expect(getTextChildNumber(CERO)).toBe(0);
    expect(getTextChildNumber(UNO)).toBe(1);
    expect(getTextChildNumber(DOS)).toBe(2);
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
      findIsland(element, {
        __islands: {
          "the-island": { island: "the island" },
        },
      })
    ).toEqual({
      island: "the island",
    });
  });
});
