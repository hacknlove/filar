const { isAModule } = require("./isAModule");

describe("isAModule", () => {
  it("should return true for a module", () => {
    expect(isAModule("fs")).toBe(true);
  });

  it("should return false for a non-module", () => {
    expect(isAModule("non-module")).toBe(false);
  });
});
