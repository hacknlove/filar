const { ServerElements } = require("./index");

test("should return a warning if the component does not exist", () => {
  expect(ServerElements["WrongElement"].toString()).toBe(
    "<!--WrongElement does not exists-->"
  );
});
