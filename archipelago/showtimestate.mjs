export const state = {};

const proxyHandler = {
  get: (target, key) => {
    if (key === "__state__") {
      return target.state;
    }
    if (key === "__route__") {
      return target.route.substr(0, target.route.length - 1);
    }
    if (key === "__keys__") {
      return Object.keys(target.state);
    }
    if (target.state[key] === null) {
      return null;
    }
    if (!target.state[key]) {
      return target.state[key];
    }
    if (typeof target.state[key] === "object") {
      return new Proxy(
        {
          state: target.state[key],
          route: `${target.route}${key}.`,
        },
        proxyHandler
      );
    }
    return target.state[key];
  },
  set: (target, key, value) => {
    const oldValue = target.state[key];
    target.state[key] = value;
    const original = {
      route: `${target.route}${key}`,
      oldValue,
      value,
    };
    document.dispatchEvent(
      new CustomEvent("state", {
        detail: original,
      })
    );
    document.dispatchEvent(
      new CustomEvent(`state.${target.route}${key}`, {
        detail: {
          route: `${target.route}${key}`,
          value,
          original,
        },
      })
    );

    const route = target.route.split(".");
    route.pop();
    let subroute = "";
    let stateIndex = state;
    for (const sub of route) {
      subroute += sub + ".";
      stateIndex = stateIndex[sub];
      document.dispatchEvent(
        new CustomEvent(`state.${subroute}*`, {
          detail: {
            route: `${subroute}*`,
            value: stateIndex,
            original,
          },
        })
      );
    }
  },
};

function initialize() {
  const proxy = new Proxy(
    {
      state,
      route: "",
    },
    proxyHandler
  );

  if (document.__debug__) {
    document.__debug__.showtimestate = proxy;
  }

  return proxy;
}

export const showtimestate =
  typeof document === "undefined" ? state : initialize();
