const { buildAll } = require("../server/build/all");
const { initializeServerElements } = require("../server/se/initialize");
const { watchServerElements } = require("../server/se/watch");
const { rmdir } = require("node:fs/promises");

jest.mock("../server/se/initialize");
jest.mock("../server/build/all");
jest.mock("../server/se/watch");

jest.mock("node:fs/promises", () => ({
  rmdir: jest.fn(),
}));

jest.mock("./argv", () => ({
  generateConfig: jest.fn(() => ({
    from: "test",
  })),
}));

test("main no watch", async () => {
  await require("../cli/build");

  expect(rmdir).toHaveBeenCalledWith("test/.build", {
    recursive: true,
    force: true,
  });
  expect(initializeServerElements).toHaveBeenCalledTimes(1);
  expect(buildAll).toHaveBeenCalledTimes(1);
  expect(watchServerElements).toHaveBeenCalledTimes(0);
});
