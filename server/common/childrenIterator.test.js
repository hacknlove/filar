const {
  childrenIterator,
  childrenDeepIterator,
} = require("./childrenIterator");
const { DOMParser } = require("linkedom");

const parser = new DOMParser();

describe("childrenIterator", () => {
  it("iterates through children", () => {
    const document = parser.parseFromString(`
            <div>
                <div>child1</div>
                <div>child2</div>
                <div>child3</div>
            </div>
        `).firstElementChild;

    const children = Array.from(childrenIterator(document));

    expect(
      children.filter((node) => node.nodeType === 1).map((c) => c.textContent)
    ).toEqual(["child1", "child2", "child3"]);
  });
});

describe("childrenDeepIterator", () => {
  it("iterates through children", () => {
    const document = parser.parseFromString(`
            <div>
                <div>child1</div>
                <div>child2</div>
                <div>child3</div>
            </div>
        `).firstElementChild;

    const children = Array.from(childrenDeepIterator(document));

    expect(
      children.filter((node) => node.nodeType === 1).map((c) => c.textContent)
    ).toEqual(["child1", "child2", "child3"]);
  });

  it("iterates through children and grandchildren", () => {
    const document = parser.parseFromString(`
            <div id="1">
                <div id="1-1" />
                <div id="1-2">
                    <div id="1-2-1" />
                    <div id="1-2-2" />
                </div>
                <div id="1-3" />
            </div>
        `).firstElementChild;

    const children = Array.from(childrenDeepIterator(document));

    expect(
      children.filter((node) => node.nodeType === 1).map((c) => c.id)
    ).toEqual(["1-1", "1-2-1", "1-2-2", "1-2", "1-3"]);
  });
});
