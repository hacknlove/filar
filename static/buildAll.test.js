const { build } = require("./build");
const { buildAll } = require("./buildAll");
const { globAsync } = require("../helpers/globAsync");

jest.mock("./build", () => ({
    build: jest.fn(),
}));

jest.mock("../helpers/globAsync", () => ({
    globAsync: jest.fn(),
}));

describe("buildAll", () => {
    it ("should build all", async () => {
        globAsync.mockResolvedValue(["file1.html", "file2.html"]);

        await buildAll({
            from: "from",
            to: "to",
        });

        expect(build).toHaveBeenCalledWith({
            from: "from",
            to: "to",
            filePath: "file1.html",
        });
        expect(build).toHaveBeenCalledWith({
            from: "from",
            to: "to",
            filePath: "file2.html",
        });
    });
});