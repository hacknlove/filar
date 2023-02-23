# filar

Filar is a HTML framework, which aims to:

- Use compliant HTML
- Keep everything as standard and vanilla as possible.
- Focus on the syntax, not on the implementation, so other implementations can be made.
- Enable the users to get the most of it writing the minimum possible amount of JS.

## Keypoints

For the project

- No need to maintain a custom parser
- No need to maintain transpilation systems

For the users of the framework

- No need to learn a new language, or a new syntax
- Be able to use any of the existing tools
- No need to be a proficient JavaScript developer

## Build process

The HTML files are processed at build time to interpolate the expressions values accordingly to the context, and to replace the custom server elements tags by the actual client side html

### Context

Context is inherit from parents by children who can override it, before using it and passing it down to their children.

The value of any CamelCase attribute is evaluated as a js expresion, and its value is set to the context.

You can surround any JS expression by double curly brackets, and it will be replaced by its value in the current context.

Example

```html
<div title="'The foo bar thing'">
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

Another way to set context is by the server custom element `Context`

#### With tag `<Context />`

The context element updates the current context that will be used by the next siblings.

If the innerText is JSON, it will be assigned to the context

Example

```html
<div>
  <Context> { "Title": "The foo bar thing" } </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

If the innerText is javascript, it we evaluated with the context as a variable called `context` so you can change it.

Example

```html
<div>
  <Context> context.Title = "The foo bar thing" </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

You can set the src attribute to load a JSON file os js script. The src can be a absolute path, from the root of the website, or a relative path, from the main html file, (Not the ServerCustomElement file).

Example

```html
<div>
  <Context src="/some/absoulte/path.json" />
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

You can set the src attribute to fetch a REST API endpoint, and the response will be asigned to the context.

```html
<div>
  <Context src="https://some.api.com/endpoint" />
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

It's possible to use both, the src and the innerText. In this case, the src is processed before, so you can use the innerText to map the response.

```html
<div>
  <Context src="https://some.api.com/endpoint">
    <!--
    Let's say that the response is
    {
        "data": {
            "title": "The foo bar thing"
        }
    }
-->
    contest.Title = context.data.title delete context.data.title
  </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

### Server Custom Elements

Any CapitalizedCamelCase tag is considered a Server Custom Element.

To define Server Custom Elements you create a `WhateverTagName.se.html` file or `WhateverTagName.se.js` file.

#### html server components

In the case of `.se.html` files, they are just have regular html. The only requiriment is that they need to have only 1 root element.

Example: `SomeCustomServerElement.se.html`

```html
<div>
    <h1>{{Title}}</div>
    <h2>{{Subtitle}}</div>
</div>
```

##### slots

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
  Title="My Element's Title"
  Subtitle="My Element's Subtitle"
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

##### named slots

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
<SomeCustomServerElement Title="My Element's Title">
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

##### slot's default content

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
<SomeCustomServerElement Title="My Element's Title">
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

##### Duplicate slots

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
<SomeCustomServerElement Title="My Element's Title">
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

#### js server components

In the case of `.se.js` files, they are cjs modules that exports a function named `processCustomElement` which accepts three arguments, the `element`, the `context` and `processAllElements` function.

Example: `SomeCustomServerElement.se.js`

```js
exports.processCustomElement = function processCustomElement(
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

### built-in server custom elements

#### SSR

This is not a server custom element, but it's a special case.

It tells the framework to not process any children of the element at build time, but to process them at runtime.

It also creates a `<script class="ssr">` element with the current build time content of the element, so it can be processed at server side rendering time. This script element is removed after the element is processed at server side rendering time.

Example:
`index.html`

```html
<div SomeContext="42">
  <p>This is processed at build time. {{SomeContext}}</p>
  <SSR>
    <p>This is processed at server side rendering time. {{SomeContext}}</p>
    <SomeChildren />
  </SSR>
</div>
```

Renders

```html
<div SomeContext="42">
    <p>This is processed at build time. 42</p>
    <SSR>
        <script class="ssr">
            {
                "SomeContext": 42
            }
        </script>
        <p>This is processed at server side rendering time. {{SomeContext}}</p>
        <SomeChildren />
    </script>
</div>
```

NOTE!: This `script` element approach was added before the `Context` server custom element was added, so maybe it should be revisited.

#### Context

It modifies the context of the next siblings.

It has been thoughtfully documented in the [Context](#context) section.

#### ForEach

It iterates over an array and renders the children for each item.

It accepts the following attributes:

- `key`: The key used to store the item in the context.
- `iterator`: an expression that evaluates to an iterable object. It can be just the name of a variable that stores the iterable, or a more complex expression.
- `filter`: (Optional) an expression that evaluates to a boolean. It can be just the name of a variable that stores the boolean, or a more complex expression. If the expression evaluates to `false`, the item will not be rendered.

Example:
`index.html`

```html
<div>
  <ForEach key="item" iterator="[1, 2, 3, 4, 5]" filter="item % 2">
    <p>{{item}}</p>
  </ForEach>
</div>
```

Renders

```html
<div>
  <p>1</p>
  <p>3</p>
  <p>5</p>
</div>
```

#### If

It renders the children if the expression evaluates to `true`.

It accepts one attribute:

- condition: an expression that evaluates to a boolean. It can be just the name of a variable that stores the boolean, or a more complex expression.

Example:

`index.html`

```html
<div>
  <If condition="true">
    <p>This is rendered</p>
  </If>
  <If condition="false">
    <p>This is not rendered</p>
  </If>
</div>
```

Renders

```html
<div>
  <p>This is rendered</p>
</div>
```

#### Island

It creates a reactive state for the client side runtime.

At server side, the island set the state values from expresions that are evaluated within the context.

The island interpolation is done with `{(` and `)}`, like `{(some expresion here)}` syntax, to keep it different from the build time and server side interpolation.

Island interpolation only uses the state of the island.

Note: Server side interpolation uses the state of the island and the server side context, but it's not reactive.

Example:
`index.html`

```html
<div title="'This is a title! '">
  <Island title="Title" times="2">
    <p>{(Title.repeat(times))}</p>
  </Island>
</div>
```

In the previous example state of the island is

```json
{
  "title": "This is a title! ",
  "times": 2
}
```

And the build process, or the server side rendering process, will render

```html
<div>
  <script>
    <!-- internal stuff for the client runtime -->
  </script>
  <p>This is a title! This is a title!</p>
</div>
```

Then if the client side runtime changes the state of the island to

```json
{
  "title": "This is a title! ",
  "times": 3
}
```

The client side runtime will update the DOM to

```html
<div>
  <script>
    <!-- internal stuff for the client runtime -->
  </script>
  <p>This is a title! This is a title! This is a title!</p>
</div>
```

#### WIP - Ideas

Should Islands be nestable?
If they are nestable:

- All the parent's state is inherited directly?
- Is it accessible through `parent.key` approach?
- The inherit keys need to be explicit added with attributes on the child island referencing the parent island keys?
- Should event handlers live in the island state?
- Do we need some special syntax for event handlers?
- Do we need some special syntax for enhance the island at run time with API calls, or js imports?

### Custom Elements

Custom elements are declared automatically by `kebab-case.ce.html` or `kebab-case.ce.mjs` files.

#### WIP - Ideas

Custom elements should be rendered at build time and server side rendering time, without shadow DOM, to avoid flickering.

Are we going to replace the innerHTML with shadow DOM at hidration time?
I guess no.

But, we should enable the client to create more elements. For this we can create templates, add them to the DOM, so we can use them to add the custom elements children.

Should custom elements be islands by default? NO

## Server Side Rendering

The context for some routes might depend on the HTTP request, on API requests, or function responses at the time of rendering the HTML

The server side render time will finish the HTML processing, by taking care of the `<SSR>` elements and its children, which have been previously skipped at build time.

The rules for the server side rendering are the same as the build time, but:

- There are directives that can be used to do redirections, change the status code, etc.
- the context have some extra values from the request

## Client side runtime

The Client side runtime relies on two mechanisms:

- reactive islands
- custom elements

Both mechanisms have been documented previously, because they are used too by the build time and server side rendering.

## Development

```bash
npm install
npm run dev
```
