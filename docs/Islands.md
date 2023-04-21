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

Islands can be nested, but state is not inherit at all. Each islands stays isolated.

## Share state between islands

At server side, the best way to share state between islands is to set the values at a shared ancestor's context.

```html
<div UserName="John">
  <p __ username="UserName">{(username)}</p>
  <input value="{(username)}" __ username="UserName" />
</div>
```

At client side, you need js to share state between islands.
Listen to the `state` event of the island you want to share the state with, and update the state of the other island.

```html
<div UserName="John">
  <p __ nick="UserName.toLowerCase()">Nick: {(nick)}</p>
  <input value="{(username)}" __ username="UserName" />
  <script>
    const input = document.currentScript.previousElementSibling;
    const p = input.previousElementSibling;

    input.addEventListener("input", (event) => {
      input.state.username = event.target.value;
    });
    input.addEventListener("state", (event) => {
      p.state.nick = input.state.username.toLowerCase();
    });
  </script>
</div>
```

This exampls is stupid, because it would be better to make only one island at the div. But, there would be other times where you won't be able to do this.

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
