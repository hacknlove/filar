import { __test__ } from "./island.mjs";

const { setNewText } = __test__;

test("hasAttribute", () => {
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
