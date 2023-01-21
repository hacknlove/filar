
const { customComponents } = require('./customComponents');

async function processCustomComponent (component) {
    const customComponent = customComponents[component.tagName]; 

    component.outerHTML = customComponent;
}

exports.processCustomComponent = processCustomComponent;