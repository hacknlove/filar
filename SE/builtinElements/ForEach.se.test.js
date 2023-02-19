const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { customElementsMap } = require("../common");
const parser = new DOMParser();

const ForEach = require("./ForEach.se");

describe("ForEach", () => {
  it("throws if the iterator is empty", async () => {
    const document = parser.parseFromString(`
                <div Title="'My title'">
                  <ul>
                    <ForEach>
                      <li>{{Item}}</li>
                    </ForEach>
                  </ul>
                </div>
            `);

    customElementsMap.set("ForEach", ForEach);

    await expect(() => processAllElements(document)).rejects.toThrow();
  });

  it("renders the children for each item in the iterator", async () => {
    const document = parser.parseFromString(`
        <div Title="'My title'">
          <ul>
            <ForEach key="Item" iterator="['one', 'two', 'three']">
              <li>{{Item}}</li>
            </ForEach>
          </ul>
        </div>
    `);

    customElementsMap.set("ForEach", ForEach);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });

  it("filters out with the filter", async () => {
    const document = parser.parseFromString(`
        <div Title="'My title'">
          <ul>
            <ForEach key="Item" iterator="['one', 'two', 'three', 'four', 'five', 'six']" filter="Item.length > 3">
              <li>{{Item}}</li>
            </ForEach>
          </ul>
        </div>
    `);

    customElementsMap.set("ForEach", ForEach);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
});
