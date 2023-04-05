# Islands

Islands are a mechanism to create a bounded state that is reactive for the
client side runtime, but does a pre-interpolation at server side as well to
avoid flickering on load.

To create an island, you need to use the `<Island>` tag and pass the state as
attribute:

```html
<div id="foo">
 <Island title="`Hello world`" count=0>
  <h1>{(title)}</h1>
  <p>{(count)}</p>
  <button onclick="foo.state.count++">Increment</button>
  <input onchange="event => {foo.state.title = event.target.value}">
</div>
```

## Interpolation.

The island interpolation is done with `{(` and `)}`, like `{(some expresion here)}` syntax, to keep it different from the server side context interpolation.

## Updating the state.

The island state is updated by using the `state` property of the island root element.

You can find the island root element using any of the methods provided by the DOM, and also using the global method `closestIsland`.

```js
function clickHandler(event) {
  const island = closestIsland(event.target);
  island.state.count++;
}
```

## Nesting

Islands can be nested, but state is not automatically inherit.

If you want to use something from the parent Island in the child island, you can use `parent(expression)`

**Example**

```html
<article>
  <Island foo="42" />
  <p>{(foo)}</p>
  <section>
    <Island bar="parent(foo * 2)" />
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
<div>
  <Island id="island1" foo="42">
    <p>{(foo)}</p>
  </Island>
</div>
<div>
  <Island id="island2" bar="from('island1', foo * 2)">
    <p>{(bar)}</p>
  </Island>
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
