const { build } = require("./build");
const { readFile, outputFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
  outputFile: jest.fn(),
}));

jest.mock("../SE/processAllElements", () => ({
  processAllElements: jest.fn(),
}));

describe("build", () => {
  it("should build", async () => {
    readFile.mockResolvedValue("<div />");

    await build({
      from: "from",
      to: "to",
      filePath: "filePath",
    });

    expect(readFile).toHaveBeenCalledWith("from/filePath", "utf8");
    expect(outputFile).toHaveBeenCalledWith("to/filePath", "<div />");
  });
  it("throwns on error", async () => {
    readFile.mockRejectedValue("error");

    await expect(() =>
      build({
        from: "from",
        to: "to",
        filePath: "filePath",
      })
    ).rejects.toThrow();
  });
});
