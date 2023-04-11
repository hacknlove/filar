# Built-in Server Elements

## SSR

It enables, for its children, the dynamic context which includes values coming
from the HTTP request.

Example: `index.html`

```html
<div SomeContext="42">
  <p>This is processed at build time. {{foo}}</p>
  <SSR>
    <p>This is processed at server side rendering time. {{query.bar}}</p>
    <SomeChildren />
  </SSR>
</div>
```

_See [Context](Context.md#static-and-ssr-context) for more information about the
context._

## Context

It modifies the context of the next siblings.

It has been thoughtfully documented in the [Context](/Context.md) section.

## ForEach

Iterates over an array and renders the children for each item.

Accepts the following attributes:

- `key`: The key used to store the item in the context.
- `of`: an expression that evaluates to an iterable object. It can be just the
  name of a variable that stores the iterable, or a more complex expression.
- `filter`: (Optional) an expression that evaluates to a Boolean. If the
  expression evaluates to `false`, the item will be filtered out.

Example: `index.html`

```html
<div>
  <ForEach key="item" of="[1, 2, 3, 4, 5]" filter="item % 2">
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

## If

Renders the children if the expression evaluates to `true`.

Accepts one attribute:

- Condition: an expression that evaluates to a Boolean.

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

## Island

Creates a bounded state that is reactive for the client side runtime, but the
interpolation is done at server side as well, to avoid flickering on the client
side rendering.

```html
<div id="foo" __ likes="0" dislikes="0">
  <h1>Likes: {(likes)} Dislikes: {(dislikes)}</h1>
  <button onclick="foo.state.likes++">Like</button>
  <button onclick="foo.state.dislikes++">Dislike</button>
</div>
```

See [Islands](Islands.md) for more information about interpolation.
