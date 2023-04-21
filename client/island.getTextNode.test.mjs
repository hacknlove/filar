import { __test__ } from "./island.mjs";

const { getTextNode } = __test__;

describe("getTextNode", () => {
  let elementNode;

  beforeEach(() => {
    elementNode = document.createElement("div");
  });

  test("should return the first text node when requested with number 0", () => {
    elementNode.innerHTML = "Text 1<span>Text 2</span>Text 3";
    const textNode = getTextNode(elementNode, 0);

    expect(textNode.nodeType).toBe(Node.TEXT_NODE);
    expect(textNode.textContent).toBe("Text 1");
  });

  test("should return the second text node when requested with number 1", () => {
    elementNode.innerHTML = "Text 1<span>Text 2</span>Text 3";
    const textNode = getTextNode(elementNode, 1);

    expect(textNode.nodeType).toBe(Node.TEXT_NODE);
    expect(textNode.textContent).toBe("Text 3");
  });

  test("should return a newly created text node when no text node exists at the specified number", () => {
    elementNode.innerHTML = "<span>Text 1</span>";
    const textNode = getTextNode(elementNode, 0);

    expect(textNode.nodeType).toBe(Node.TEXT_NODE);
    expect(textNode.textContent).toBe("");
  });

  test("should append a newly created text node to the elementNode when no text node exists at the specified number", () => {
    elementNode.innerHTML = "<span>Text 1</span>";
    const textNode = getTextNode(elementNode, 0);

    expect(elementNode.childNodes).toContain(textNode);
  });
});
