const { childrenIterator } = require("../helpers/childrenIterator");
const { customElements } = require("./");

function getTemplateSlots(template) {
  const slots = new Map();

  slots.set(" no unnamed slot ", { name: "", elements: [], used: false });

  for (const slot of template.querySelectorAll("slot")) {
    const name = slot.getAttribute("name") ?? "";

    const group = slots.get(name) ?? { name, elements: [], used: false };

    group.elements.push(slot);

    slots.set(name, group);
  }

  return slots;
}

function sendChildToSlot({ child, templateSlots, customElement, component }) {
  const slotName = child.getAttribute?.("slot") ?? "";
  child.removeAttribute?.("slot");
  child.remove();

  const slotGroup = templateSlots.get(slotName);

  if (!slotGroup) {
    if (slotName) {
      console.warn(
        `Slot "${slotName}" not found in custom element "${component.tagName}"`
      );
      return;
    }

    customElement.appendChild(child);
    return;
  }

  slotGroup.used = true;

  for (const slot of slotGroup.elements) {
    slot.parentNode.insertBefore(child.cloneNode(true), slot);
  }
}

function defaultSlots(templateSlots) {
  for (const slotGroup of templateSlots.values()) {
    if (slotGroup.used) {
      for (const slot of slotGroup.elements) {
        slot.remove();
      }
      continue;
    }

    for (const slot of slotGroup.elements) {
      for (const child of childrenIterator(slot)) {
        if (child.nodeType === 3 && !child.textContent.trim()) {
          continue;
        }
        slot.parentNode.insertBefore(child, slot);
      }
      slot.remove();
    }
  }
}

async function processCustomElement(component, context, processElements) {
  const customElement = customElements[component.tagName];

  if (customElement.processCustomElement) {
    await customElement.processCustomElement(
      component,
      context,
      processElements
    );
    return;
  }

  const templateSlots = getTemplateSlots(customElement);

  for (const child of childrenIterator(component)) {
    if (child.nodeType === 3 && !child.textContent.trim()) {
      continue;
    }
    sendChildToSlot({ child, templateSlots, customElement, component });
  }

  defaultSlots(templateSlots);

  customElement.classList.add(component.tagName);

  component.parentNode.replaceChild(customElement, component);

  await processElements(customElement, context);
}

exports.processCustomElement = processCustomElement;
