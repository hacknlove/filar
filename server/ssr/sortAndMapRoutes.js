const { readFile } = require("fs-extra");

function sortAndMapRoutes(routes) {
  const response = routes.map((route) => {
    const file = readFile(route, "utf-8");

    if (route.includes("#")) {
        return {
            file,
            forSort: '',
            expressPath: null,
        };
    }

    // remove the extension and the name if it's index

    let expressPath = '/' + route.replace(/\/?(index)?\.html$/, "");

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
      file,
      route,
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
        cause: { expressPath: a.expressPath,
            filePaths: [a.route, b.route],
        }
    });
  });

  response.forEach((route) => {
    delete route.forSort;
    delete route.route;
  });

  return response;
}

exports.sortAndMapRoutes = sortAndMapRoutes;
