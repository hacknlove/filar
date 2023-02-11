const status = require("./status.directive").status;

describe("status directive", () => {
  it("should set the status code", () => {
    const req = {};
    const res = {
      status: jest.fn(),
    };
    const node = {
      getAttribute: jest.fn(() => "200"),
    };
    status(req, res, node);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
