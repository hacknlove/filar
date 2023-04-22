import { jest } from "@jest/globals";

import { __test__ } from "./island.mjs";
const {
  before__,
  contextRegexp,
  fullState,
  getOldText,
  getTextChildNumber,
  getTextNode,
  hasAttribute,
  proxyHandler,
  setNewText,
} = __test__;

describe("before__", () => {
  test("returns true when the name appears before __ in the list", () => {
    const list = ["a", "b", "c", "__", "d", "e"];
    const name = "c";

    const result = before__(list, name);

    expect(result).toBe(true);
  });

  test("returns false when the name appears after __ in the list", () => {
    const list = ["a", "b", "__", "c", "d", "e"];
    const name = "d";

    const result = before__(list, name);

    expect(result).toBe(false);
  });

  test("returns false when the list does not contain the name", () => {
    const list = ["a", "b", "__", "c", "d", "e"];
    const name = "f";

    const result = before__(list, name);

    expect(result).toBe(false);
  });

  test("returns false when the list contains only __", () => {
    const list = ["__"];
    const name = "a";

    const result = before__(list, name);

    expect(result).toBe(false);
  });

  test("returns false when the list is empty", () => {
    const list = [];
    const name = "a";

    const result = before__(list, name);

    expect(result).toBe(false);
  });
});

describe("contextRegexp", () => {
  test("should match expressions with single parentheses", () => {
    const testString = "Hello, {(name)}!";
    const matches = Array.from(testString.matchAll(contextRegexp));

    expect(matches.length).toBe(1);
    expect(matches[0][0]).toBe("{(name)}");
    expect(matches[0][1]).toBe("name");
  });

  test("should match multiple expressions", () => {
    const testString = "Welcome {(firstName)} {(lastName)} to our website!";
    const matches = Array.from(testString.matchAll(contextRegexp));

    expect(matches.length).toBe(2);
    expect(matches[0][0]).toBe("{(firstName)}");
    expect(matches[0][1]).toBe("firstName");
    expect(matches[1][0]).toBe("{(lastName)}");
    expect(matches[1][1]).toBe("lastName");
  });

  test("should not match expressions without parentheses", () => {
    const testString = "Hello, {name}!";
    const matches = Array.from(testString.matchAll(contextRegexp));

    expect(matches.length).toBe(0);
  });

  test("should not match expressions with unmatched parentheses", () => {
    const testString = "Hello, {(name)} to {(city!";
    const matches = Array.from(testString.matchAll(contextRegexp));

    expect(matches.length).toBe(1);
    expect(matches[0][0]).toBe("{(name)}");
    expect(matches[0][1]).toBe("name");
  });
});

describe("fullState", () => {
  test("returns the full state of a node with islands", () => {
    const node1 = {
      island: {
        raw: {
          state: {
            foo: "bar",
          },
        },
      },
      parentNode: {
        island: {
          raw: {
            state: {
              baz: "qux",
            },
          },
        },
        parentNode: null,
      },
    };

    const result = fullState(node1);

    expect(result).toEqual({
      foo: "bar",
      baz: "qux",
    });
  });

  test("returns an empty object when no island is found", () => {
    const node1 = {
      parentNode: null,
    };

    const result = fullState(node1);

    expect(result).toEqual({});
  });
});

test("getOldText", () => {
  const div = document.createElement("div");
  div.innerHTML = '<span id="test" class="test-class">Hello<br/>World</span>';

  const span = div.querySelector("#test");

  expect(getOldText(span, "id")).toBe("test");
  expect(getOldText(span, "class")).toBe("test-class");

  expect(getOldText(span, "t-0")).toBe("Hello");
  expect(getOldText(span, "t-1")).toBe("World");
});

describe("getTextChildNumber", () => {
  it("returns the correct number of text node siblings", () => {
    const div = document.createElement("div");
    div.innerHTML = "Text1<span></span>Text2<span></span>Text3";
    const firstChild = div.firstChild;
    const secondTextNode = firstChild.nextSibling.nextSibling;

    expect(getTextChildNumber(firstChild)).toBe(0);
    expect(getTextChildNumber(secondTextNode)).toBe(1);
  });

  it("returns 0 when there are no text node siblings", () => {
    const div = document.createElement("div");
    div.innerHTML = "<span></span>Text1";
    const firstTextNode = div.firstChild.nextSibling;

    expect(getTextChildNumber(firstTextNode)).toBe(0);
  });
});

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

test("hasAttribute", () => {
  const div = document.createElement("div");
  div.innerHTML = '<span id="test" class="test-class">Hello<br/>World</span>';

  const span = div.querySelector("#test");

  expect(hasAttribute(span, "id")).toBe(true);
  expect(hasAttribute(span, "class")).toBe(true);
  expect(hasAttribute(span, "data-test")).toBe(false);

  expect(hasAttribute(span, "t-0")).toBe(true);
  expect(hasAttribute(span, "t-1")).toBe(true);
  expect(hasAttribute(span, "t-2")).toBe(false);
});

describe("proxyHandler", () => {
  document.islands = {
    island1: {
      refresh: jest.fn(),
    },
  };

  test("returns the value of the state property when getting a property", () => {
    const target = {
      raw: {
        state: {
          foo: "bar",
        },
      },
      id: "island1",
    };

    const result = new Proxy(target, proxyHandler).foo;

    expect(result).toBe("bar");
  });

  test("sets the value of the state property and refreshes the corresponding island when setting a property", () => {
    const target = {
      raw: {
        state: {
          foo: "bar",
        },
      },
      id: "island1",
    };

    const proxy = new Proxy(target, proxyHandler);
    proxy.foo = "baz";

    expect(target.raw.state.foo).toBe("baz");
    expect(document.islands[target.id].refresh).toHaveBeenCalled();
  });

  test("sets the value deep in the state property and refreshes the corresponding island when setting a property", () => {
    const target = {
      raw: {
        state: {
          foo: {
            bar: "baz",
          },
        },
      },
      id: "island1",
    };

    const proxy = new Proxy(target, proxyHandler);
    proxy.foo.bar = "qux";

    expect(target.raw.state.foo.bar).toBe("qux");
    expect(document.islands[target.id].refresh).toHaveBeenCalled();
  });
});

test("setNewText", () => {
  const div = document.createElement("div");
  div.innerHTML = '<span id="test" class="test-class">Hello<br/>World</span>';

  const span = div.querySelector("#test");

  setNewText(span, "id", "test-id");
  setNewText(span, "class", "test-class-2");

  setNewText(span, "t-0", "Hello World");
  setNewText(span, "t-1", "Hello World 2");

  expect(span.getAttribute("id")).toBe("test-id");
  expect(span.getAttribute("class")).toBe("test-class-2");
  expect(span.firstChild.textContent).toBe("Hello World");
  expect(span.firstChild.nextSibling.nextSibling.textContent).toBe(
    "Hello World 2"
  );
});
