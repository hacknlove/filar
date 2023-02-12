const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { customElementsMap } = require("../common");
const parser = new DOMParser();

const If = require("./If.se");

describe("If", () => {
  it("renders the content if the condition is truthy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body Condition="{|true|}">
                    <If key="Condition">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    customElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
  it("does not render the content if the condition is falsy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body Condition="{|false|}">
                    <If key="Condition">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    customElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
  it("renders the content if the condition is truthy (expression)", async () => {
    const document = parser.parseFromString(`
            <html>
                <body>
                    <If key="Condition" Condition="{|5 > 4|}">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    customElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });

  it("does not render the content if the condition is falsy (expression)", async () => {
    const document = parser.parseFromString(`
            <html>
                <body>
                    <If key="Condition" Condition="{|5 < 4|}">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    customElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
});
