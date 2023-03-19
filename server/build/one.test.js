const { buildOne } = require("./one");
const { readFile, outputFile } = require("fs-extra");

jest.spyOn(console, "log").mockImplementation(() => {});

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
  outputFile: jest.fn(),
}));

jest.mock("../tree/processAllElements", () => ({
  processAllElements: jest.fn(),
}));

jest.mock("../config", () => ({
  from: "from",
}));

describe("buildOne", () => {
  it("output static files to static folder", async () => {
    readFile.mockResolvedValue("<div />");

    await buildOne("filePath");

    expect(readFile).toHaveBeenCalledWith("from/filePath", "utf8");
    expect(outputFile).toHaveBeenCalledWith(
      "from/.build/static/filePath",
      "<div />"
    );
  });
  it("output ssr files to ssr folder", async () => {
    readFile.mockResolvedValue("<div><SSR><div /></SSR></div>");

    await buildOne("filePath");

    expect(readFile).toHaveBeenCalledWith("from/filePath", "utf8");
    expect(outputFile).toHaveBeenCalledWith(
      "from/.build/ssr/filePath",
      "<div><SSR><div /></SSR></div>"
    );
  });
  it("throwns on error", async () => {
    readFile.mockRejectedValue("error");

    await expect(() => buildOne("filePath")).rejects.toThrow();
  });
});
