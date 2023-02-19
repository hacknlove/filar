const { processCustomElement } = require("./TestJsElement.se.js");

describe("useless", () => {
  it("useless", () => {
    processCustomElement({
      remove: () => {},
    });
    expect(processCustomElement).toEqual(processCustomElement);
  });
});
