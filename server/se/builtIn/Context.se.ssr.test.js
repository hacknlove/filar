const { DOMParser } = require("linkedom");
const { processAllElements } = require("../../tree/processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const Context = require("./Context.se");
const { createFakeContext } = require("../../../test/fakeContext");

jest.mock("../../config", () => ({
  from: "server/se/builtIn",
}));

describe("Context ssr", () => {
  it("skips only ssr context", async () => {
    const document = parser.parseFromString(`
    <div Title="'My title'">
        <Context src="/test/context.js" ssr="true" ></Context>
        <h1>{{Title}}</h1>
    </div>
`);

    ServerElementsMap.set("Context", Context);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });
});
