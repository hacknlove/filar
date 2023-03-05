const { resolve } = require("path");
const { generateConfig } = require("./argv");

describe("argv", () => {
  beforeEach(() => {
    process.argv = ["node", "filar"];
    process.env.FROM = "";
  });
  it("defaults from to cwd", async () => {
    process.argv = ["node", "filar"];
    const config = await generateConfig();
    expect(config.from).toBe(process.cwd());
  });
  it("takes from from FROM env variable", async () => {
    process.env.FROM = "testenv";
    const config = await generateConfig();
    expect(config.from).toBe(resolve(process.cwd(), "testenv"));
  });

  it("takes from from --from paramter", async () => {
    process.argv = ["node", "filar", "--from", "testparam"];
    const config = await generateConfig();
    expect(config.from).toBe(resolve(process.cwd(), "testparam"));
  });

  it("resolves absolute paths", async () => {
    process.argv = ["node", "filar", "--from", "/testparam"];
    const config = await generateConfig();
    expect(config.from).toBe("/testparam");
  });

  it("Overrides with filar.config.js", async () => {
    process.argv = ["node", "filar", "--from", "test/argv"];
    jest.mock(
      resolve(process.cwd(), "test/argv", "filar.config.js"),
      () => (config) => {
        config.test = "test";
      }
    );
    const config = await generateConfig();
    expect(config.test).toBe("test");
  });

  it("requires and attaches middleware, if it exists", async () => {
    process.argv = ["node", "filar", "--from", "test/argv"];
    jest.mock(
      resolve(process.cwd(), "test/argv", "middleware.js"),
      () => () => {}
    );
    const config = await generateConfig();
    expect(typeof config.middleware).toBe("function");
  });

  it("requires and attaches middleware, if it is a string", async () => {
    process.argv = [
      "node",
      "filar",
      "--from",
      "test/argv",
      "--middleware",
      "byParamMiddleware.js",
    ];
    jest.mock(
      resolve(process.cwd(), "test/argv", "byParamMiddleware.js"),
      () => () => {}
    );
    const config = await generateConfig();
    expect(typeof config.middleware).toBe("function");
  });

  it("requires and attaches router, if it exists", async () => {
    process.argv = ["node", "filar", "--from", "test/argv"];
    jest.mock(resolve(process.cwd(), "test/argv", "router.js"), () => () => {});
    const config = await generateConfig();
    expect(typeof config.router).toBe("function");
  });

  it("requires and attaches router, if it is a string", async () => {
    process.argv = [
      "node",
      "filar",
      "--from",
      "test/argv",
      "--router",
      "byParamMiddleware.js",
    ];
    jest.mock(
      resolve(process.cwd(), "test/argv", "byParamMiddleware.js"),
      () => () => {}
    );
    const config = await generateConfig();
    expect(typeof config.middleware).toBe("function");
  });
});
