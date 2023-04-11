# Islands

Islands are a mechanism to create a bounded state that is reactive for the
client side runtime, but does a pre-interpolation at server side as well to
avoid flickering on load.

To create an island, you need to use the empty attribute `__` in any element.

Attributes before `__` are regular HTML attributes.
Attributes after `__` are island attributes. They aren't rendered into the output HTML, they are added to the state of the island.

```html
<div id="foo" __ title="`Hello world`" count="0">
  <h1>{(title)}</h1>
  <p>{(count)}</p>
  <button onclick="foo.state.count++">Increment</button>
  <input onchange="event => {foo.state.title = event.target.value}" />
</div>
```

## Interpolation.

The island interpolation is done with `{(` and `)}`, like `{(some expresion here)}` syntax.

Notice that ` {{``}} ` is only server side interpolation. It will use the server side context and the island state at the time of the rendering, but it won't be reactive at all.

## Updating the state.

The island state can be by:

- Mutating the `state` property of the root island element.
- Changing any root island element's attribute after the `__`

There is an important difference.

By mutating `state` you set the actual value.
By changing the attribute, the attribute value will be evaluated as a JS expression in the context of the island state, in the same way it works for rendering an element.

You can find the island root element using any of the methods provided by the DOM, and also using the global method `closestIsland`.

```js
function clickHandler(event) {
  const island = closestIsland(event.target);
  island.state.count++;
}
```

The island state is updated by changing any element attribute after `__`

## Nesting

Islands can be nested, but state is not automatically inherit.

If you want to use something from the parent Island in the child island, you can use `parent(expression)`

**Example**

```html
<article __ foo="42">
  <p>{(foo)}</p>
  <section __ bar="parent(foo * 2)">
    <p>{(bar)}</p>
  </section>
</article>
```

**Output**

```html
<article>
  <p>42</p>
  <section>
    <p>84</p>
  </section>
</article>
```

## Cross island

In a similar way, you can also share state between islands by its ID with the helper `from(islandId, expression)`

In this case, the origin island needs to have and `id` and to be initialized before the destination island.

**Example**

```html
<div id="island1" __ foo="42">
  <p>{(foo)}</p>
</div>
<div id="island2" __ bar="from('island1', foo * 2)">
  <p>{(bar)}</p>
</div>
```

**Output**

```html
<div>
  <p>42</p>
</div>
<div>
  <p>84</p>
</div>
```

### Heads up

Usually, "initialized before" means that the island is declared before the other island in the HTML, but islands inside SSR tags are initialized after the SSR tag is rendered.

## Events

Islands emit the following events:

- `state`: when the state is updated.
- `island-ready`: when the island is ready to be used.

The `document` emits the `islands-ready` event when all the islands are ready.

```js
const island = document.getElementById("foo");
island.addEventListener("state", (event) => {
  //
});
island.addEventListener("island-ready", (event) => {
  //
});
document.addEventListener("islands-ready", (event) => {
  //
});
```
