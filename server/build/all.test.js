const { buildOne } = require("./one");
const { buildAll } = require("./all");
const { globAsync } = require("../common/globAsync");

jest.mock("./one", () => ({
  buildOne: jest.fn(),
}));

jest.mock("../common/globAsync", () => ({
  globAsync: jest.fn(),
}));

describe("all", () => {
  it("should build all", async () => {
    globAsync.mockResolvedValue(["file1.html", "file2.html"]);

    await buildAll({
      from: "from",
      to: "to",
    });

    expect(buildOne).toHaveBeenCalledWith({
      from: "from",
      to: "to",
      filePath: "file1.html",
    });
    expect(buildOne).toHaveBeenCalledWith({
      from: "from",
      to: "to",
      filePath: "file2.html",
    });
  });
});
