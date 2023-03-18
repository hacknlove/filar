const { getUniqueIdentifiers } = require("./getUniqueIdentifiers");

describe("getUniqueIdentifiers", () => {
  test("extracts member expressions with single level", () => {
    const expression = "obj.prop1 === obj.prop2";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["obj.prop1", "obj.prop2"]);
  });

  test("extracts member expressions with multiple levels", () => {
    const expression = "foo.bar.buz.whatever === another.example.property";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual([
      "foo.bar.buz.whatever",
      "another.example.property",
    ]);
  });

  test("extracts a mix of member expressions and identifiers", () => {
    const expression = "area === 3.14 * radius * radius";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["area", "radius"]);
  });

  test("returns an empty array for an expression with no identifiers", () => {
    const expression = "3.14 * 10 * 10";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual([]);
  });

  test("handles complex expressions with a mix of cases", () => {
    const expression = "const area = Math.PI * circle.radius * circle.radius;";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["Math.PI", "circle.radius"]);
  });
  test("extracts identifiers while ignoring strings", () => {
    const expression = "title === 'my title'";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["title"]);
  });
  test("does not extract identifiers used in variable declarations", () => {
    const expression = "const area = Math.PI * radius * radius;";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["Math.PI", "radius"]);
  });
  test("does not include identifiers inside function declarations", () => {
    const expression =
      "function calculateArea(radius) { return Math.PI * radius * radius; }";
    const result = getUniqueIdentifiers(expression);
    expect(result).toEqual(["calculateArea", "radius", "Math.PI"]);
  });
});
