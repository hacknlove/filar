const { buildOne } = require("./one");
const { build } = require("./index");
const { globAsync } = require("../common/globAsync");

jest.mock("./one", () => ({
  buildOne: jest.fn(),
}));

jest.mock("../common/globAsync", () => ({
  globAsync: jest.fn(),
}));

describe("build", () => {
  it("should build", async () => {
    globAsync.mockResolvedValue(["file1.html", "file2.html"]);

    await build();

    expect(buildOne).toHaveBeenCalledWith("file1.html", 0, [
      "file1.html",
      "file2.html",
    ]);
    expect(buildOne).toHaveBeenCalledWith("file2.html", 1, [
      "file1.html",
      "file2.html",
    ]);
  });
});
