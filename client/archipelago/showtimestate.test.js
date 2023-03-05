describe.skip("ShowtimeState", () => {
  afterEach(async () => {
    const { state } = await import("./showtimestate.mjs");

    for (const key in state) {
      delete state[key];
    }
  });
  it("gives the keys", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    showtimestate.foo = {};
    showtimestate.bar = {};
    showtimestate.buz = {};

    expect(showtimestate.__keys__).toEqual(["foo", "bar", "buz"]);
  });
  it("dispatches events", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    const stateEventHandler = jest.fn();
    const stateRoutePartialEventHandler = jest.fn();
    const stateRouteEventHandler = jest.fn();

    document.addEventListener("state", stateEventHandler);

    document.addEventListener("state.foo.bar.*", stateRoutePartialEventHandler);

    document.addEventListener("state.foo.bar.buz", stateRouteEventHandler);

    showtimestate.foo = {};

    expect(stateEventHandler).toHaveBeenCalledTimes(1);
    expect(stateRoutePartialEventHandler).toHaveBeenCalledTimes(0);
    expect(stateRouteEventHandler).toHaveBeenCalledTimes(0);
    expect(stateEventHandler.mock.calls[0][0].detail).toEqual({
      route: "foo",
      oldValue: undefined,
      value: {},
    });

    showtimestate.foo.bar = {};

    expect(stateEventHandler).toHaveBeenCalledTimes(2);
    expect(stateRoutePartialEventHandler).toHaveBeenCalledTimes(0);
    expect(stateRouteEventHandler).toHaveBeenCalledTimes(0);
    expect(stateEventHandler.mock.calls[1][0].detail).toEqual({
      route: "foo.bar",
      oldValue: undefined,
      value: {},
    });

    showtimestate.foo.bar.buz = { buz: true };

    expect(stateEventHandler).toHaveBeenCalledTimes(3);
    expect(stateRoutePartialEventHandler).toHaveBeenCalledTimes(1);
    expect(stateRouteEventHandler).toHaveBeenCalledTimes(1);
    expect(stateEventHandler.mock.calls[2][0].detail).toEqual({
      route: "foo.bar.buz",
      oldValue: undefined,
      value: { buz: true },
    });
    expect(stateRoutePartialEventHandler.mock.calls[0][0].detail).toEqual({
      route: "foo.bar.*",
      value: { buz: { buz: true } },
      original: {
        route: "foo.bar.buz",
        oldValue: undefined,
        value: { buz: true },
      },
    });
    expect(stateRouteEventHandler.mock.calls[0][0].detail).toEqual({
      route: "foo.bar.buz",
      value: { buz: true },
      original: {
        route: "foo.bar.buz",
        oldValue: undefined,
        value: { buz: true },
      },
    });

    showtimestate.foo.bar.buz.buz = false;

    expect(stateEventHandler).toHaveBeenCalledTimes(4);
    expect(stateRoutePartialEventHandler).toHaveBeenCalledTimes(2);
    expect(stateRouteEventHandler).toHaveBeenCalledTimes(1);
    expect(stateEventHandler.mock.calls[3][0].detail).toEqual({
      route: "foo.bar.buz.buz",
      oldValue: true,
      value: false,
    });
    expect(stateRoutePartialEventHandler.mock.calls[1][0].detail).toEqual({
      route: "foo.bar.*",
      value: { buz: { buz: false } },
      original: {
        route: "foo.bar.buz.buz",
        oldValue: true,
        value: false,
      },
    });
  });

  it("works with null, undefined, and other types", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    showtimestate.tryNull = null;
    showtimestate.tryUndefined = undefined;
    showtimestate.tryArray = [1];
    showtimestate.tryObject = {};
    showtimestate.tryNumber = 0;
    showtimestate.tryString = "";
    showtimestate.tryBoolean = false;
    showtimestate.tryFunction = () => {};

    expect(showtimestate.tryNull).toBe(null);
    expect(showtimestate.tryUndefined).toBe(undefined);
    expect(showtimestate.tryArray.__state__).toEqual([1]);
    expect(showtimestate.tryObject.__state__).toEqual({});
    expect(showtimestate.tryNumber).toBe(0);
    expect(showtimestate.tryString).toBe("");
    expect(showtimestate.tryBoolean).toBe(false);
    expect(showtimestate.tryFunction).toBeInstanceOf(Function);
  });

  it("gives the route", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    showtimestate.foo = {};
    showtimestate.foo.bar = {};
    showtimestate.foo.bar.buz = { buz: true };

    expect(showtimestate.foo.bar.buz.__route__).toBe("foo.bar.buz");
  });

  it("gives the fucking keys", async () => {
    const { showtimestate } = await import("./showtimestate.mjs");

    showtimestate.foo = {};
    showtimestate.bar = {};
    showtimestate.buz = {};

    expect(showtimestate.__keys__).toEqual(["foo", "bar", "buz"]);
  });
});
