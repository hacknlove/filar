const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const Context = require("./Context.se");

describe("Context inner text", () => {
  it("changes parent context from JSON", async () => {
    const document = parser.parseFromString(`
            <div Title="'My title'">
                <Context>
                    {
                        "Title": "My Updated title",
                        "Other": "Other"
                    }
                </Context>
                <h1>{{Title}}</h1>
                <h2>{{Other}}</h2>
            </div>
        `);

    ServerElementsMap.set("Context", Context);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });

  it("changes parent context from js", async () => {
    const document = parser.parseFromString(`
            <div Title="'My title'">
                <Context>
                    context.Title = "My Updated title";
                </Context>
                <h1>{{Title}}</h1>
            </div>
        `);

    ServerElementsMap.set("Context", Context);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });

  it("throws when inner text is not valid", async () => {
    const document = parser.parseFromString(`
            <div Title="'My title'">
                <Context>
                  {
                    context.Title: "My Updated title"
                </Context>
                <h1>{{Title}}</h1>
            </div>
        `);

    ServerElementsMap.set("Context", Context);

    await expect(() => processAllElements(document)).rejects.toThrow();
  });
});
