const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { ServerElementsMap } = require("../common");

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

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, {
      from: "SE/builtIn",
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

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, {
      from: "SE/builtIn",
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

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, {
      from: "SE/builtIn",
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

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, {
      from: "SE/builtIn",
      filePath: "test/index.html",
    });

    expect(document.toString()).toMatchSnapshot();
  });
});

describe("Context fromFile", () => {
  it("throws if the src cannot be found", async () => {
    await expect(
      Context.__test__.fromFile("/cannot/be/found", {
        from: "SE/builtIn",
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });

  it("throws if the src cannot be parsed", async () => {
    await expect(
      Context.__test__.fromFile("/test/wrong.json", {
        from: "SE/builtIn",
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });

  it("throws if there is a transform function, and it errors", async () => {
    await expect(
      Context.__test__.fromFile("/test/wrongTransform.js", {
        from: "SE/builtIn",
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });
});
