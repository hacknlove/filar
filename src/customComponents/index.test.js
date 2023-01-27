const { customComponents } = require("./index");

test("should return a warning if the component does not exist", () => {
    expect(customComponents["wrong-component"]).toBe(
        "<!-- wrong-component does not exists -->"
    );
});
