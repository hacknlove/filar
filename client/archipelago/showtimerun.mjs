import { showtimestate } from "./showtimestate.mjs";

function manageElement(element) {
  const showtime = JSON.parse(element.dataset.showtime);

  element.showTimeEventListeners = [];

  for (const property in showtime) {
    const [js, ...events] = showtime[property];

    const fn = new Function(
      ["showtimestate"],
      `\
        const { ${Object.keys(showtimestate).join(", ")} } = showtimestate;
        return ${js};\n`
    );

    let eventHandler;

    if (property === "textContent") {
      eventHandler = () => {
        element.textContent = fn(showtimestate);
      };
    } else {
      eventHandler = () => {
        element.setAttribute(property, fn(showtimestate));
      };
    }
    element.showTimeEventListeners.push({
      events,
      eventHandler,
    });
    for (const event of events) {
      document.addEventListener(event, eventHandler);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-showtime]").forEach(manageElement);
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.removedNodes.forEach((node) => {
        if (node.showTimeEventListeners) {
          node.showTimeEventListeners.forEach(({ events, eventHandler }) => {
            for (const event of events) {
              document.removeEventListener(event, eventHandler);
            }
          });
        }
      });

      mutation.addedNodes.forEach((node) => {
        if (node.dataset.showtime) {
          manageElement(node);
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
