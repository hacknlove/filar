const { DOMParser } = require("linkedom");
const { processAllElements } = require("../../tree/processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const If = require("./If.se");

ServerElementsMap.set("If", If);
const { createFakeContext } = require("../../../test/fakeContext");

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

    await processAllElements(document, createFakeContext());

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

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });
});
