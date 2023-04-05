const { processServerElement } = require("./TestJsElement.se.js");

describe("useless", () => {
  it("useless", () => {
    processServerElement({
      remove: () => {},
    });
    expect(processServerElement).toEqual(processServerElement);
  });
});
