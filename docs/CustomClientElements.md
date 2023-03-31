### Custom Elements

Custom elements will be declared automatically by `kebab-case.ce.html` or `kebab-case.ce.mjs` files.

#### WIP - Ideas

Custom elements should be rendered at build time and server side rendering time, without shadow DOM, to avoid flickering.

Are we going to replace the innerHTML with shadow DOM at hidration time?
I guess no.

But, we should enable the client to create more elements. For this we can create templates, add them to the DOM, so we can use them to add the custom elements children.

Should custom elements be islands by default? NO
