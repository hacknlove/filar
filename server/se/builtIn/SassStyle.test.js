const parser = new (require("linkedom").DOMParser)();
const { ServerElementsMap } = require("../common");
const { processAllElements } = require("../../tree/processAllElements");
const config = require("../../config");
const { join } = require("path");
const { readFile } = require("fs-extra");
const { saveIfDifferent } = require("../../common/saveIfDifferent");
const { globAsync } = require("../../common/globAsync");
const { createFakeContext } = require("../../../test/fakeContext");

jest.mock("fs-extra");
jest.mock("../../common/saveIfDifferent");
jest.mock("../../config", () => ({
  from: __dirname,
  staticDir: ".build/static",
}));
jest.mock("../../common/globAsync");

const SassStyle = require("./SassStyle.se");

ServerElementsMap.set("SassStyle", SassStyle);

describe("processServerElement", () => {
  it("compiles and adds style to head", async () => {
    const document = parser.parseFromString(`
            <html>
                <head></head>
                <body>
                    <SassStyle embedded color1="red" color2="#fabada"/>
                </body>
            </html>s
        `);

    globAsync.mockResolvedValue(["test.scss", "test2.scss"]);

    readFile.mockResolvedValueOnce(`h1 { color: var(--color1); }`);
    readFile.mockResolvedValueOnce(`h2 { color: var(--color2); }`);

    await processAllElements(document, createFakeContext());

    expect(document.querySelector("style")).not.toBeNull();
    expect(document.toString()).toMatchSnapshot();
  });

  it("compiles and adds link to head", async () => {
    const document = parser.parseFromString(`
            <html>
                <head></head>
                <body>
                    <SassStyle color1="red" color2="#fabada"/>
                </body>
            </html>s
        `);

    globAsync.mockResolvedValue(["test.scss", "test2.scss"]);

    readFile.mockResolvedValueOnce(`h1 { color: var(--color1); }`);
    readFile.mockResolvedValueOnce(`h2 { color: var(--color2); }`);

    await processAllElements(document, createFakeContext());

    expect(document.querySelector("style")).toBeNull();
    expect(document.querySelector("link")).not.toBeNull();
    expect(saveIfDifferent).toHaveBeenCalledWith(
      join(
        config.from,
        ".build",
        "static",
        document.querySelector("link").getAttribute("href")
      ),
      expect.any(String)
    );
    expect(document.toString()).toMatchSnapshot();
  });
});
