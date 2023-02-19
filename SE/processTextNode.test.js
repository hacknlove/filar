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

    const island = document.getElementById("island");
    const span = document.getElementById("span");
    const textNode = span.firstChild;

    island.island = { foo: "Hola" };

    processTextNode(textNode, {}, island.island);

    expect(textNode.textContent.match(/^\s*Hola\s*$/)).toBeTruthy();
  });
});

describe("getChildNumber", () => {
  it("counts the number of previous siblings", () => {
    const document = parser.parseFromString(`
      <ul>
        <li id="li1" />
        <li id="li2" />
        <li id="li3" />
      </ul>
    `);

    const li1 = document.getElementById("li1");
    const li2 = document.getElementById("li2");
    const li3 = document.getElementById("li3");

    expect(__test__.getChildNumber(li1)).toBe(1);
    expect(__test__.getChildNumber(li2)).toBe(3);
    expect(__test__.getChildNumber(li3)).toBe(5);
  });
});

describe("findIsland", () => {
  it("returns the closest up island", () => {
    const document = parser.parseFromString(`
      <div id="root">
        <div id="island">
          <div>
            <div id="element" />
          </div>
        </div>
      </div>
    `);

    const root = document.getElementById("root");
    const island = document.getElementById("island");
    const element = document.getElementById("element");

    root.island = { name: "root" };
    island.island = { closest: true };

    expect(__test__.findIsland(element)).toBe(island.island);
  });
});
