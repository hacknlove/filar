const { getPage } = require("./pages");
const { processAllElements } = require("../tree/processAllElements");
const { dirname } = require("path");
const { childrenIterator } = require("../common/childrenIterator");

async function renderPage(req, res, next) {
  const page = res.page;

  const SSRTags = page.querySelectorAll("SSR");

  const context = {
    filePath: res.filePath,
    dir: dirname(res.filePath),
    body: req.body || {},
    query: req.query || {},
    params: req.params || {},
    cookies: req.cookies || {},
    headers: req.headers || {},
  };

  for (const tag of SSRTags) {
    const newContextScript = tag.firstElementChild;
    const newContext = { ...context };

    if (
      newContextScript &&
      newContextScript.tagName === "script" &&
      newContextScript.classList.has("ssr")
    ) {
      Object.assign(newContext, JSON.parse(newContextScript.innerHTML));
    }

    processAllElements(tag, newContext);

    for (const newChild of childrenIterator(tag)) {
      tag.parentNode.insertBefore(newChild, tag);
    }

    tag.remove();
  }

  next();
}

function addRoute(app, route) {
  app.get(
    route.expressPath,
    async (req, res, next) => {
      const page = await getPage(route.filePath).catch(next);

      if (!page) {
        return;
      }

      res.page = page;
      res.filePath = route.filePath;
      next();
    },
    renderPage
  );
}

exports.addRoute = addRoute;
