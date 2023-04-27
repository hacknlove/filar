const { childrenIterator } = require("../common/childrenIterator");
const { ClientElements } = require("./");

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

function sendChildToSlot({ child, templateSlots, dom, element }) {
  const slotName = child.getAttribute?.("slot") ?? "";
  child.removeAttribute?.("slot");
  child.remove();

  const slotGroup = templateSlots.get(slotName);

  if (!slotGroup) {
    if (slotName) {
      throw new Error("Slot not found", {
        cause: {
          slotName,
          tagName: element.tagName,
        },
      });
    }

    dom.appendChild(child);
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

async function processClientElement(element, context, processElements) {
  const { dom, js } = ClientElements[element.tagName];

  const templateSlots = getTemplateSlots(dom);

  for (const child of childrenIterator(element)) {
    if (child.nodeType === 3 && !child.textContent.trim()) {
      continue;
    }
    sendChildToSlot({ child, templateSlots, dom, element });
  }

  defaultSlots(templateSlots);

  element.replaceChildren(...dom.childNodes);

  if (js) {
    context.__ce[element.tagName] = js;
  }

  await processElements(dom, context);
}

exports.processClientElement = processClientElement;
