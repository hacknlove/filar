const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const If = require("./If.se");

describe("if condition", () => {
  it("renders the content if the condition evaluates to truthy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body ValueA=5 ValueB=6>
                    <If condition="ValueA < ValueB">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    ServerElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
  it("does not renders the content if the condition evaluates to falsy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body ValueA=5 ValueB=6>
                    <If condition="ValueA > ValueB">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    ServerElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
});