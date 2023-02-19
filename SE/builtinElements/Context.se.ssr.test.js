const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { customElementsMap } = require("../common");
const parser = new DOMParser();

const Context = require("./Context.se");

describe("Context ssr", () => {
  it("skips only ssr context", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="/test/context.js" ssr="true" ></Context>
        <h1>{{Title}}</h1>
    </div>
`);

    customElementsMap.set("Context", Context);

    await processAllElements(document, {
      from: "SE/builtinElements",
      filePath: "test/index.html",
    });

    expect(document.toString()).toMatchSnapshot();
  });
});
