# Context

Context is a server-side system designed to facilitate the passing of data from
parent components to their descendants in a hierarchical manner.

Here's a simple example:

```html
<div Title="'The foo bar thing'">
  <div Slug="Title.toLowerCase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

To set values within the context, simply add CamelCase attributes to any
element. The attribute value is evaluated within the current context and then
assigned to the context.

These attributes are known as Context Attributes and are not included in the
final HTML output.

Because the value of the Context Attributes is always evaluated, if you want to
use them to set a string, you need to use an expression that returns a string,
like `'foo'`, `"foo"` or `` `foo` ``.

To access a value from the context, you can use the `{{}}` syntax.

Please note that this context is server-side only:

- it's not sent to the client
- it's not reactive

## Static and SSR context

By default, the context receives some static context like:

- `config`: from `filar.config.js` and overwritten by CLI arguments and
  environment variables (see [Configuration](#configuration)).
- `filePath`: The path of the HTML file of the current page being rendered.
- `dir`: The directory of the HTML file of the current page being rendered.
- All the fields from `config.context` (see [Configuration](#configuration)).
- All the fields from `[filePath].context.json` or `[filePath].context.js`. See
  [Context files](#context-files).

The context of children of the built-in server element `SSR` will be enhanced
with some extra fields coming from the request: _see [SSR](Built-inServerElements.md#ssr)_.

- `isSSR` will be `true`
- `body` equals to `req.body`
- `query` equals to `req.query`
- `params` equals to `req.params`
- `cookies` equals to `req.cookies`
- `headers` equals to `req.headers`

## Using the `<Context />` tag

The built-in server element `Context` allows you to set the context for the next
siblings, the children of the next siblings, and the current element.

### JSON

If the `Context` tag's content is JSON, it will be parsed and assigned to the
context.

Example

```html
<div>
  <Context> { "Title": "The foo bar thing" } </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

### JavaScript

If the `Context` tag's content is JavaScript, it is evaluated with the current
context as a variable called `context`, to be mutated.

Example

```html
<div>
  <Context> context.Title = "The foo bar thing" </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

This javaScript code needs to be synchronous.

### Using the `src` attribute

You can set the `src` attribute to load a JSON file or JS script. The `src` can
be an absolute path (from the root of the website); or a relative path (from the
current page's HTML file).

Example

```html
<div>
  <Context src="/some/absoulte/path.json" />
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

If the file is a `.js` file, and it exports a function, the function will be
called with the context as a parameter.

It should update the context it receives, the returned value will be awaited and
ignored, so the function can be async or return a Promise.

Example

```html
<div>
  <Context src="/some/absoulte/path.js" />
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

```js
// /some/absoulte/path.js
module.exports = function (context) {
  context.Title = "The foo bar thing";
};
```

#### Fetching from a REST API endpoint

You can set the `src` attribute to fetch a REST API endpoint, and the response
will be assigned to the context.

Response of `GET https://some.api.com/endpoint`

```json
{
  "Title": "The foo bar thing"
}
```

```html
<div>
  <Context src="https://some.api.com/endpoint" />
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

#### Combining `src` and innerText

It's possible to use both, the `src` and the innerText. In this case, the `src`
is processed first, allowing you can use the innerText to map the response.

Response of `GET https://some.api.com/endpoint`

```json
{
  "data": {
    "title": "The foo bar thing"
  }
}
```

```html
<div>
  <Context src="https://some.api.com/endpoint">
    contest.Title = context.data.title; delete context.data;
  </Context>
  <div Slug="Title.toLowercase().replace(/ /g, '-')">
    <a title="{{Title}}" href="foo/{{Slug}}">{{Title}}</a>
  </div>
</div>
```

## Configuration

If the configuration has a `context` field, it will be merged with the context.

Example

```js
// filar.config.js
module.exports = {
  context: {
    Title: "The foo bar thing",
  },
};
```

If this field is a function, it will be called with the context as a parameter to be mutated.

Example

```js
// filar.config.js
module.exports = {
  context: (context) => {
    context.Title = "The foo bar thing";
  },
};
```

## Context files

You can create a `[filePath].context.json` or `[filePath].context.js` file to set the context for the page.

Example

```json
// /foo/bar/baz.html.context.json
{
  "Title": "The foo bar thing"
}
```

JS exporting an object:

```js
// /foo/bar/baz.html.context.js
module.exports = {
  Title: "The foo bar thing",
};
```

JS exporting a function:

```js
// /foo/bar/baz.html.context.js
module.exports = (context) => {
  context.Title = "The foo bar thing";
};
```
