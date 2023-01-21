const express = require('express');
const app = express();
const { readFile } = require('fs-extra');
const { resolvePath } = require('./resolvePath');
const { DOMParser } = require('linkedom');
const { processCustomComponents } = require('./processCustomComponents');
const { customComponentsInit } = require('./customComponents');

app.use(express.static('./public'))

app.use(async (req, res) => {
    const filePath = resolvePath(req.path);

    const file = await readFile(filePath, 'utf8');

    const document = new DOMParser().parseFromString(file);

    processCustomComponents(document);

    res.send(document.toString());
});

customComponentsInit().then(() => {
    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });
});
