const express = require('express');
const app = express();
const { readFile } = require('fs-extra');
const { resolvePath } = require('./resolvePath');

app.use(async (req, res) => {
    const filePath = resolvePath(req.path);

    const file = await readFile(filePath, 'utf8');
    res.send(file);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});