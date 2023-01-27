const processCustomComponent = require("./processOne");
const { customComponentsMap } = require("./common");

describe("processCustomComponent", () => {
  it("should replace the component with the custom component", () => {
    customComponentsMap.set(
      "test-component",
      "test component content"
    );
    document.body.innerHTML = "<test-component />";

    processCustomComponent.processCustomComponent(
      document.body.querySelector("test-component")
    );

    expect(document.body.innerHTML).toBe("test component content");
  });
});
