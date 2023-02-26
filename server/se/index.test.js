const { ServerElements } = require("./index");

test("throws if the component does not exist", () => {
  expect(() => ServerElements["WrongElement"]).toThrow();
});
