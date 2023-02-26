const { getRoot } = require("./getRoot");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

test("getRoot", () => {
  const document = parser.parseFromString(`
        <div id="theRoot">
            <div>
                <div>
                    <div id="theChild" />
                </div>
            </div>
        </div>
    `);

  const root = getRoot(document.getElementById("theChild"));

  expect(root).toBe(document.getElementById("theRoot"));
});
