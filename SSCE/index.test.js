const { customElements } = require("./index");

test("should return a warning if the component does not exist", () => {
    expect(customElements["WrongElement"].toString()).toBe(
        "<!--WrongElement does not exists-->"
    );
});
