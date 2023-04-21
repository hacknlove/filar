import { __test__ } from "./island.mjs";

const { getOldText } = __test__;

test("hasAttribute", () => {
  const div = document.createElement("div");
  div.innerHTML = '<span id="test" class="test-class">Hello<br/>World</span>';

  const span = div.querySelector("#test");

  expect(getOldText(span, "id")).toBe("test");
  expect(getOldText(span, "class")).toBe("test-class");

  expect(getOldText(span, "t-0")).toBe("Hello");
  expect(getOldText(span, "t-1")).toBe("World");
});
