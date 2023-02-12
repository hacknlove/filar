const { build } = require("./build");
const { readFile, outputFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
  outputFile: jest.fn(),
}));

jest.mock("../SSCE/processAllElements", () => ({
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
  it("warns on error", async () => {
    readFile.mockRejectedValue("error");
    jest.spyOn(console, "error").mockImplementation(() => {});

    await build({
      from: "from",
      to: "to",
      filePath: "filePath",
    });

    expect(console.error).toHaveBeenCalledWith("error");
  });
});
