const { buildAll } = require("../server/build/all");
const { initializeServerElements } = require("../server/se/initialize");
const { watchServerElements } = require("../server/se/watch");

jest.mock("../server/se/initialize");
jest.mock("../server/build/all");
jest.mock("../server/se/watch");

test("main no watch", async () => {
  await require("../cli/build");

  expect(initializeServerElements).toHaveBeenCalledTimes(1);
  expect(buildAll).toHaveBeenCalledTimes(1);
  expect(watchServerElements).toHaveBeenCalledTimes(0);
});
