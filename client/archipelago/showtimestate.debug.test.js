describe.skip("ShowtimeState", () => {
  it("has debug mode", async () => {
    document.__debug__ = {};

    const { showtimestate } = await import("./showtimestate.mjs");

    expect(document.__debug__.showtimestate).toBe(showtimestate);
  });
});
