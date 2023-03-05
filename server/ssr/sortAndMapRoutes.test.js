const { sortAndMapRoutes } = require("./sortAndMapRoutes");
jest.mock("fs-extra", () => ({
    readFile: jest.fn(filename => filename),
}));

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
            expressPath: null,
            file: "#/hidden.html",
        },
        {
            expressPath: "/",
            file: "index.html",
        },
        {
            expressPath: "/blog",
            file: "blog/index.html",
        },
        {
            expressPath: "/blog/foo/:slug*",
            file: "blog/[[...slug]].html",
        },
        {
            expressPath: "/blog/:slug",
            file: "blog/[slug].html",
        },
        {
            expressPath: "/foo/:slug+",
            file: "[...slug].html",
        },
        {
            expressPath: "/:slug",
            file: "[slug].html",
        }
    ]);
  });
  it('throws an error if there are duplicate routes', () => {
    const routes = [
      "foo/index.html",
      "foo.html",
    ];

    expect(() => sortAndMapRoutes(routes)).toThrow();
  })
});
