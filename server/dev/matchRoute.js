const { match } = require("path-to-regexp");

const { sortAndMapRoutes } = require("../ssr/sortAndMapRoutes");

const config = require("../config");

const { globAsync } = require("../common/globAsync");

async function matchOne(url) {
  const files = await globAsync("**/*.html", {
    cwd: config.from,
    ignore: ["./.build/**", "./.dev/**"],
  });

  const routes = sortAndMapRoutes(files);

  for (const route of routes) {
    const regexp = match(route.expressPath);
    const params = regexp(url);
    if (params) {
      return {
        filePath: route.filePath,
        params,
      };
    }
  }

  return {
    filePath: null,
    params: {},
  };
}

exports.matchOne = matchOne;
