import { __test__ } from "./island.mjs";

const { contextRegexp } = __test__;

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
