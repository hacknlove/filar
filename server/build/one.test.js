const { buildOne } = require("./one");
const { readFile, outputFile } = require("fs-extra");

jest.mock("fs-extra", () => ({
  readFile: jest.fn(),
  outputFile: jest.fn(),
}));

jest.mock("../tree/processAllElements", () => ({
  processAllElements: jest.fn(),
}));

describe("buildOne", () => {
  it("should buildOne", async () => {
    readFile.mockResolvedValue("<div />");

    await buildOne({
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
      buildOne({
        from: "from",
        to: "to",
        filePath: "filePath",
      })
    ).rejects.toThrow();
  });
});
