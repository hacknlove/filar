// saveIfDifferent.test.js
const { saveIfDifferent } = require("./saveIfDifferent");
const { readFile, outputFile } = require("fs-extra");
const { join } = require("path");
const os = require("os");

jest.mock("fs-extra");

describe("saveIfDifferent", () => {
  const testFile = join(os.tmpdir(), "testfile.txt");
  const testContent = "This is a test content.";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save the file if it does not exist", async () => {
    readFile.mockRejectedValue({ code: "ENOENT" });

    await saveIfDifferent(testFile, testContent);

    expect(readFile).toHaveBeenCalledWith(testFile, "utf8");
    expect(outputFile).toHaveBeenCalledWith(testFile, testContent);
  });

  it("should save the file if the contents are different", async () => {
    readFile.mockResolvedValue("Old content");

    await saveIfDifferent(testFile, testContent);

    expect(readFile).toHaveBeenCalledWith(testFile, "utf8");
    expect(outputFile).toHaveBeenCalledWith(testFile, testContent);
  });

  it("should not save the file if the contents are the same", async () => {
    readFile.mockResolvedValue(testContent);

    await saveIfDifferent(testFile, testContent);

    expect(readFile).toHaveBeenCalledWith(testFile, "utf8");
    expect(outputFile).not.toHaveBeenCalled();
  });

  it("should throw an error if the file cannot be read", async () => {
    const errorMessage = "File cannot be read";
    readFile.mockRejectedValue(new Error("Some error"));

    await expect(saveIfDifferent(testFile, testContent)).rejects.toThrow(
      errorMessage
    );
    expect(readFile).toHaveBeenCalledWith(testFile, "utf8");
    expect(outputFile).not.toHaveBeenCalled();
  });
});
