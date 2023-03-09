const { sortAndMapRoutes } = require("./sortAndMapRoutes");
jest.mock("./pages");

describe("sortAndMapRoutes", () => {
  it("sorts the files by especificity", () => {
    const routes = [
      "index.html",
      "[...slug].html",
      "[slug].html",
      "blog/[slug].html",
      "blog/index.html",
      "#/hidden.html",
      "blog/[[...slug]].html",
    ];

    const sortedRoutes = sortAndMapRoutes(routes);

    expect(sortedRoutes).toEqual([
      {
        expressPath: "/",
        filePath: "index.html",
      },
      {
        expressPath: "/blog",
        filePath: "blog/index.html",
      },
      {
        expressPath: "/blog/foo/:slug*",
        filePath: "blog/[[...slug]].html",
      },
      {
        expressPath: "/blog/:slug",
        filePath: "blog/[slug].html",
      },
      {
        expressPath: "/foo/:slug+",
        filePath: "[...slug].html",
      },
      {
        expressPath: "/:slug",
        filePath: "[slug].html",
      },
    ]);
  });
  it('throws an error if there are duplicate routes', () => {
    const routes = [
      "foo/index.html",
      "foo.html",
    ];

    expect(() => sortAndMapRoutes(routes)).toThrow();
  });
});
