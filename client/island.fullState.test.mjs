import { __test__ } from "./island";
const { fullState } = __test__;

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
