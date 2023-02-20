const { DOMParser } = require("linkedom");
const { processAllElements } = require("../processAllElements");
const { ServerElementsMap } = require("../common");
const parser = new DOMParser();

const If = require("./If.se");

describe("If key", () => {
  it("renders the content if the context[key] is truthy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body Condition=true>
                    <If key="Condition">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    ServerElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
  it("does not render the content if context[key] is falsy", async () => {
    const document = parser.parseFromString(`
            <html>
                <body Condition=false>
                    <If key="Condition">
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    ServerElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });
  it("works for local context (truthy)", async () => {
    const document = parser.parseFromString(`
            <html>
                <body>
                    <If key="Condition" Condition=5>4>
                        <span>content</span>
                    </If>
                </body>
            </html>
        `);

    ServerElementsMap.set("If", If);

    await processAllElements(document);

    expect(document.toString()).toMatchSnapshot();
  });

  it("does not render the content if the condition is falsy (expression)", async () => {
    const document = parser.parseFromString(`
            <html>
                <body>
                    <If key="Condition" Condition=false>
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
