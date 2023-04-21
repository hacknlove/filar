import { __test__ } from "./island.mjs";
const { before__ } = __test__;

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
