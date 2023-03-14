const { globAsync } = require("../common/globAsync");

jest.mock("../config", () => ({
  from: "from",
}));

jest.mock("../common/globAsync", () => ({
  globAsync: jest.fn(),
}));

describe("addRoutes", () => {
  it("sorts the files by especificity", () => {
    globAsync.mockResolvedValue([
      "index.html",
      "[...slug].html",
      "[slug].html",
      "blog/[slug].html",
      "blog/index.html",
      "blog/[slug]/index.html",
      "blog/[[...slug]].html",
      "blog.html",
    ]);
  });
});
