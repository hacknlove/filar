import { __test__ } from "./island.mjs";
const { proxyHandler } = __test__;
import { jest } from "@jest/globals";

document.islands = {
  island1: {
    refresh: jest.fn(),
  },
};

describe("proxyHandler", () => {
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
