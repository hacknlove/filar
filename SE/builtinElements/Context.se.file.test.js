const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { customElementsMap } = require("../common");
const parser = new DOMParser();

const Context = require("./Context.se");

describe("Context from file", () => {
  it("changes parent context from a json file", async () => {
    const document = parser.parseFromString(`
            <div Title="'My title'">
                <Context src="./context.json"></Context>
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

  it("changes parent context from a transform js file", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="./transform.js"></Context>
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

  it("changes parent context from a js file", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="./context.js"></Context>
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

  it("changes parent context from a js file with absolute path", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="/test/context.js"></Context>
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

  it.skip("throws if the src cannot be found", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="/test/context2.js"></Context>
        <h1>{{Title}}</h1>
    </div>
`);


    customElementsMap.set("Context", Context);

    const error = await  processAllElements(document, {
      from: "SE/builtinElements",
      filePath: "test/index.html",
    }).catch((error) => error);

    expect(error.message).toBe(
      "/Users/sergiocampos/Projects/SE/test/context2.js cannot be found"
    );
  });

  it.skip("throws if the src cannot be parsed", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="/test/wrong.json"></Context>
        <h1>{{Title}}</h1>
    </div>
`);

    customElementsMap.set("Context", Context);

    const error = await processAllElements(document, {
      from: "SE/builtinElements",
      filePath: "test/index.html",
    }).catch((error) => error);

    expect(error.message).toBe(
      "/Users/sergiocampos/Projects/SE/test/wrong.json cannot be parsed"
    );
  });
});
