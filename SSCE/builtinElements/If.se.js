const { childrenIterator } = require("../../helpers/childrenIterator");

async function processCustomElement(element, context, processAllElements) {
    const key = element.getAttribute("key");

    console.log(key, context[key], context)
    
    if (!context[key]) {
        element.remove();
        return;
    }

    await processAllElements(element, context);

    for (const child of childrenIterator(element)) {
        element.parentNode.insertBefore(child, element);
    }

    element.remove();
}

exports.processCustomElement = processCustomElement;
