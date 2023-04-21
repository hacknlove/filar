import { __test__ } from "./island.mjs";

const { hasAttribute } = __test__;

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
