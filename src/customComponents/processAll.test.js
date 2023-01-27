const { processCustomComponents } = require("./processAll");
const { processCustomComponent } = require("./processOne");
const { parseHTML } = require("linkedom");

jest.mock("./processOne", () => ({
  processCustomComponent: jest.fn(),
}));

describe("processCustomComponents", () => {
  it("should call processCustomComponent for each custom component", async () => {
    const html = `
<html>
<head>
  <title>Test</title>
</head>
<body>
  <test-tag>
    <other-test-tag/>
  </test-tag>
  <div>
    <test-tag/>
  </div>
</body>
</html>
`;
    const { document } = parseHTML(html);

    await processCustomComponents(document);

    expect(processCustomComponent).toHaveBeenCalledTimes(3);
  });
});
