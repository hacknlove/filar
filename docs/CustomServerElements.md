# Custom Server Elements

Any CapitalizedCamelCase tag is considered a Server Custom Element.

To define Server Custom Elements you create a `WhateverTagName.se.html` file or `WhateverTagName.se.js` file.

## `.se.html` server components

In the case of `.se.html` files, they are just are regular HTML. The only requeriment is that they need to have only 1 root element.

At this moment if they have more than 1 root element, only the first one will be rendered, and the rest will be silently ignored.

Example: `SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2>{{Subtitle}}</div>
</div>
```

### slots

In the basic usage of slots, all the children of the server custom element are passed to the slot.

Example:
`SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2>{{Subtitle}}</div>
    <slot></slot>
</div>
```

`some-page.html`

```html
<SomeCustomServerElement
  Title="`My Element's Title`"
  Subtitle="`My Element's Subtitle`"
>
  <p>Some content</p>
</SomeCustomServerElement>
```

This will render

```html
<div class="SomeCustomServerElement">
    <h1>My Element's Title</div>
    <h2>My Element's Subtitle</div>
    <p>Some content</p>
</div>
```

### named slots

You can define named slots, by using the `slot` attribute.

The children who have the same `slot` attribute will be passed to the slot.
The children who don't have the `slot` attribute will be passed to the default slot.

Example:
`SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2><slot name="subtitle"></slot></div>
    <slot></slot>
</div>
```

`some-page.html`

```html
<SomeCustomServerElement Title="`My Element's Title`">
  <a href="#" slot="subtitle">My Subtitle</a>
  <p>Some content</p>
</SomeCustomServerElement>
```

This will render

```html
<div class="SomeCustomServerElement">
    <h1>My Element's Title</div>
    <h2><a href="#">My Subtitle</a></div>
    <p>Some content</p>
</div>
```

### slot's default content

Any children of the slot will be the default content of the slot.

Example:
`SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2><slot name="subtitle"></slot></div>
    <slot><p>Content of <strong>{{Title}}</strong></p></slot>
</div>
```

`some-page.html`

```html
<SomeCustomServerElement Title="`My Element's Title`">
  <a href="#" slot="subtitle">My Subtitle</a>
</SomeCustomServerElement>
```

This will render

```html
<div class="SomeCustomServerElement">
    <h1>My Element's Title</div>
    <h2><a href="#">My Subtitle</a></div>
    <p>Content of <strong>My Element's Title</strong></p>
</div>
```

### Duplicate slots

If you have multiple slots with the same name, the content will be passed to all of them.

Example:
`SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2><slot name="subtitle"></slot></div>
    <slot><p>Content of <strong>{{Title}}</strong></p></slot>
    <hr/>
    <small>
        <slot name="subtitle"></slot>
    </small>
</div>
```

`some-page.html`

```html
<SomeCustomServerElement Title="`My Element's Title`">
  <a href="#" slot="subtitle">My Subtitle</a>
</SomeCustomServerElement>
```

This will render

```html
<div class="SomeCustomServerElement">
    <h1>My Element's Title</div>
    <h2><a href="#">My Subtitle</a></div>
    <p>Content of <strong>My Element's Title</strong></p>
    <hr/>
    <small>
        <a href="#">My Subtitle</a>
    </small>
</div>
```

Same for the default slot.

## `se.js` server components

In the case of `.se.js` files, they are cjs modules that exports a function named `processServerElement` which accepts three arguments, the `element`, the `context` and `processAllElements` function.

Example: `SomeCustomServerElement.se.js`

```js
exports.processServerElement = function processServerElement(
  element,
  context,
  processAllElements
) {
  // do something with the element and or the context
  // call processAllElements(element, context, processAllElements) so the children are processed
};
```

It does not return anything.

It is worth mentioning that the `element` is a [`linkedom`](https://github.com/WebReflection/linkedom) node, which is quite compatible with the DOM API, but it's not intended to be used as a DOM replacement, so there are some differences, because it aims to be as fast as possible and lightweight as possible.

You might find useful to take a look at the built-in server custom elements, which are located in the [`SE/builtin`](./SE/builtIn/) folder.
