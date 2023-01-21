const express = require("express");
const app = express();
const { resolvePath } = require("./resolvePath");
const {
  initializeCustomComponents,
} = require("./customComponents/customComponents");
const { processPage } = require("./pages");
const { initializeDirectives } = require("./directives/directives");

app.use(express.static("./public"));

app.use(async (req, res) => {
  try {
    res.send(await processPage(req, res, resolvePath(req.path)));
  } catch (error) {
    console.error(error);
    res.send(await processPage(req, res, resolvePath("/500.html")));
  }
});

async function initializeAll() {
  await Promise.all([initializeCustomComponents(), initializeDirectives()]);

  app.listen(3000, () => {
    console.info("Server listening on port 3000!");
  });
}

initializeAll();
