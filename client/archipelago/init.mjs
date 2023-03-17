export const proxyHandler = {
  get: ({ island, state, route }, key) => {
    if (key === "__state__") {
      return state;
    }
    if (key === "__route__") {
      return route.substr(0, route.length - 1);
    }
    if (key === "__keys__") {
      return Object.keys(state);
    }
    if (key === "__island__") {
      return island;
    }
    if (state[key] === null) {
      return null;
    }
    if (!state[key]) {
      return state[key];
    }
    if (typeof state[key] === "object") {
      return new Proxy(
        {
          state: state[key],
          route: `${route}${key}.`,
        },
        proxyHandler
      );
    }
    return state[key];
  },
  set: ({ state, route, island }, key, value) => {
    const oldValue = state[key];
    state[key] = value;
    const original = {
      route: `${route}${key}`,
      oldValue,
      value,
    };
    island.dispatchEvent(
      new CustomEvent("state", {
        detail: original,
      })
    );
    island.dispatchEvent(
      new CustomEvent(`state.${route}${key}`, {
        detail: {
          route: `${route}${key}`,
          value,
          original,
        },
      })
    );

    const routeArray = route.split(".");
    route.pop();
    let subroute = "";
    let stateIndex = state;
    for (const sub of routeArray) {
      subroute += sub + ".";
      stateIndex = stateIndex[sub];
      island.dispatchEvent(
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

export function manageDynamicNoce({ node, island, rawState }) {
  if (node.showTimeEventListeners) {
    return;
  }
  node.showTimeEventListeners = [];

  const showtime = JSON.parse(node.dataset.showtime);

  for (const property in showtime) {
    const [js, ...events] = showtime[property];

    const fn = new Function(
      ["rawState"],
      `\
        const { ${Object.keys(rawState).join(", ")} } = rawState;
        return ${js};\n`
    );

    let eventHandler;

    if (property === "textContent") {
      eventHandler = () => {
        island.textContent = fn(rawState);
      };
    } else {
      eventHandler = () => {
        island.setAttribute(property, fn(rawState));
      };
    }
    island.showTimeEventListeners.push({
      events,
      eventHandler,
    });
    for (const event of events) {
      document.addEventListener(event, eventHandler);
    }
  }
}

export function initShowTimeIsland(island) {
  if (island.showTimeIsland) {
    return;
  }
  island.state = new Proxy(
      {
        island,
        rawState: island.island,
        route: "",
      },
      proxyHandler
    )
}

export function manageDynamicNodes(island, rawState) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }

      for (const node of mutation.removedNodes) {
        if (!node.showTimeEventListeners) {
          continue;
        }

        for (const { events, eventHandler } of node.showTimeEventListeners) {
          for (const event of events) {
            island.removeEventListener(event, eventHandler);
          }
        }
      }

      for (const node of mutation.addedNodes) {
        if (node.dataset.showtime) {
          manageDynamicNoce({ node, island, rawState });
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export async function init(root = document) {
  const scripts = root.querySelectorAll(".island>script:first-child");

  for (const script of scripts) {
    const island = script.parentElement;
    if (island.islandRuntime) {
      console.warn(`ShowTimeIsland already initialized`, root);
      continue;
    }

    initShowTimeIsland(island);
  }
}

