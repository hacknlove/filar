const { DOMParser } = require("linkedom");
const { processAllElements } = require("../../tree/processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const Context = require("./Context.se");

describe("Context from api", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });
  afterAll(() => {
    delete global.fetch;
  });

  it("changes parent context from a get API call", async () => {
    const document = parser.parseFromString(`
            <div Title="'My title'">
                <Context src="//example.com/context"></Context>
                <h1>{{Title}}</h1>
            </div>
        `);

    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Title: "My Updated title" }),
      })
    );

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, {
      filePath: "test/index.html",
      __islands: {},
      __ce: {},
    });

    expect(document.toString()).toMatchSnapshot();
  });
});
