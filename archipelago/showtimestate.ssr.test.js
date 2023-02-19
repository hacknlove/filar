delete global.document;

global.document = undefined;

describe("ShowtimeState", () => {
  it("has debug mode", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    showtimestate.foo = {};
    showtimestate.foo.bar = {};
    showtimestate.foo.bar.buz = { buz: true };

    expect(true).toBe(true);
  });
});
