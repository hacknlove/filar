const { build } = require("../server/build");
const { initializeServerElements } = require("../server/se/initialize");
const { rmdir } = require("node:fs/promises");

jest.spyOn(console, "log").mockImplementation(() => {});

jest.mock("../server/se/initialize");
jest.mock("../server/build");

jest.mock("node:fs/promises", () => ({
  rmdir: jest.fn(() => Promise.resolve()),
}));

jest.mock("./argv", () => ({
  generateConfig: jest.fn(() => ({
    from: "test",
  })),
}));

test("main no watch", async () => {
  await require("./command-build");

  expect(rmdir).toHaveBeenCalledWith("test/.build", {
    recursive: true,
    force: true,
  });
  expect(initializeServerElements).toHaveBeenCalledTimes(1);
  expect(build).toHaveBeenCalledTimes(1);
});
