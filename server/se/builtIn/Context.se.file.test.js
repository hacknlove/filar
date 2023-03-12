const parser = new (require("linkedom").DOMParser)();

const { processAllElements } = require("../../tree/processAllElements");
const { ServerElementsMap } = require("../common");

const Context = require("./Context.se");

const config = require("../../config");

jest.mock("../../config", () => ({
  from: `${process.cwd()}/server/se/builtIn`,
}));

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
      filePath: "test/index.html",
      dir: `${config.from}/test`,
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
      filePath: "test/index.html",
      dir: `${config.from}/test`,
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
      filePath: "test/index.html",
      dir: `${config.from}/test`,
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
      filePath: "test/index.html",
      dir: `${process.cwd()}/test`,
    });

    expect(document.toString()).toMatchSnapshot();
  });
});

describe("Context fromFile", () => {
  it("throws if the src cannot be found", async () => {
    await expect(
      Context.__test__.fromFile("/cannot/be/found", {
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });

  it("throws if the src cannot be parsed", async () => {
    await expect(
      Context.__test__.fromFile("/test/wrong.json", {
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });

  it("throws if there is a transform function, and it errors", async () => {
    await expect(
      Context.__test__.fromFile("/test/wrongTransform.js", {
        filePath: "test/index.html",
      })
    ).rejects.toThrow();
  });
});
