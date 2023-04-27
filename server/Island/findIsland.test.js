const { DOMParser } = require("linkedom");
const parser = new DOMParser();
const { createFakeContext } = require("../../test/fakeContext");
const { findIsland } = require("./findIsland");

describe("findIsland", () => {
  it("returns the closest up island", () => {
    const document = parser.parseFromString(`
        <div id="root">
          <div id="the-island">
            <div>
              <div id="element" />
            </div>
          </div>
        </div>
      `);

    const element = document.getElementById("element");

    expect(
      findIsland(
        element,
        createFakeContext({
          __islands: {
            "the-island": { island: "the island" },
          },
        })
      )
    ).toEqual({
      island: "the island",
    });
  });
});
