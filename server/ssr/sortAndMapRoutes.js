function sortAndMapRoutes(routes) {
  const response = routes.map((filePath) => {
    if (filePath.includes("#")) {
      return {
        forSort: "",
      };
    }

    // remove the extension and the name if it's index

    let expressPath = "/" + filePath.replace(/\/?(index)?\.html$/, "");

    // replace the foo/[[...bar]] with foo/:bar*
    expressPath = expressPath.replace(/\[\[\.\.\.(\w+)\]\]$/, "foo/:$1*");

    // replace the foo/[[bar]] with foo{/:bar}?
    expressPath = expressPath.replace(/\[\[\.\.\.(\w+)\]\]$/, "foo{/:bar}?");

    // replace the foo/[...bar] with foo/:bar+
    expressPath = expressPath.replace(/\[\.\.\.(\w+)\]$/, "foo/:$1+");

    expressPath = expressPath.replaceAll(/\[(\w+)\]/g, ":$1");

    expressPath = expressPath.replaceAll(/\[\]/g, "(.*)");

    expressPath ||= "/";

    return {
      filePath,
      forSort: expressPath.replaceAll(/:/g, "\uffff"),
      expressPath,
    };
  });

  response.sort((a, b) => {
    if (a.forSort < b.forSort) {
      return -1;
    }
    if (a.forSort > b.forSort) {
      return 1;
    }
    console.error("Duplicate route", a.expressPath, a.route, b.route);
    throw new Error(`Duplicate route`, {
      cause: { expressPath: a.expressPath, filePaths: [a.route, b.route] },
    });
  });

  return response.filter((route) => {
    if (route.forSort === "") {
      return false;
    }
    delete route.forSort;
    delete route.route;
    return true;
  });
}

exports.sortAndMapRoutes = sortAndMapRoutes;
