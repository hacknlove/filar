const { readFile, outputFile } = require("fs-extra");

async function saveIfDifferent(path, string) {
  try {
    const fileContent = await readFile(path, "utf8");

    if (fileContent === string) {
      return;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error("File cannot be read", {
        cause: {
          path,
          error,
        },
      });
    }
  }

  return outputFile(path, string);
}

exports.saveIfDifferent = saveIfDifferent;
