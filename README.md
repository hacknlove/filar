# Filar

Filar is an HTML framework specifically designed to minimize the reliance on JavaScript, making web development more accessible to the common folk.

## Documentation

[filar/docs](https://github.com/hacknlove/filar/tree/master/docs)

## Why?

The Web is broken, if we attend to its original ideas and goals.

Back in time, html was designed to be a markup language, not a programming language. It was designed so anybody can write a web, not only JavaScript programmers.

But we, javascript programmers, in our intent to continuously improve our productivity and development experiencie, have made the web a place where only we can write it.

We completely forgot the development expecience of the common folk that cannot write JavaScript, or at most, can write a little bit of it.

I remember when I was a kid, I was able to write a web page with just HTML, CSS, and a bit of JavaScript.

I think JavaScript frameworks are great. They allow us, developers, to write very complex web applications with low effort, but for the common folk, they are too much.

For these people, I decided to create Filar, to bring them back the simplicity of the web.

## How?

Filar translates the development experience of a JavaScript framework to a HTML framework:

To list a few:

- Reusable components
- Dynamic Routing
- Reactive state
- Modular CSS

## Quick Examples

### Components

Any file with the `.se.html` extension is a Server Element.

**/components/Hello.se.html**

```html
<div>
  <h1>Hello, {{name}}!</h1>
</div>
```

**/pages/index.html**

```html
<Hello name="'World'" />
```

**Output**

```html
<div>
  <h1>Hello, World!</h1>
</div>
```

No JavaScript required at all.

### Routing

It follows the Filesystem routing pattern.

**/blog/[id].html**

```html
<SSR>
  <div>
    <h1>This is a blog {{params.id}}</h1>
  </div>
</SSR>
```

**Output**

**http://localhost:3000/blog/1**

```html
<div>
  <h1>This is a blog 1</h1>
</div>
```

**Note**
The context from the request is only available in the SSR components.

### Reactive state

You can declare reactive islands, whose state can be used by all its children.

**/pages/index.html**

```html
<div id="foo" -- likes="0" dislikes="0">
  <h1>Likes: {(likes)} Dislikes: {(dislikes)}</h1>
  <button onclick="foo.state.likes++">Like</button>
  <button onclick="foo.state.dislikes++">Dislike</button>
</div>
```

The built-in `Island` Server Element makes its parent element reactive, and initializes the state.

**Output**

```html
<script type="module" src="/[hash].mjs"></script>
...
<div id="foo">
  <h1>Likes: 0 Dislikes: 0</h1>
  <button onclick="foo.state.likes++">Like</button>
  <button onclick="foo.state.dislikes++">Dislike</button>
</div>
```

### Modular CSS

Just drop your CSS or (SCSS) files anywhere in the project, and they will be automatically loaded.

```html
<SassStyle />
```

You can set a directory and a pattern to SassStyle to load only the files you want.

```html
<SassStyle cwd="components" pattern="*.scss" />
```

**Output**

```html
<head>
  ...
  <link rel="stylesheet" href="[hash].css" type="text/css" />
</head>
```

Add the attribute `embedded` to embed the CSS in the page.

```html
<SassStyle embedded />
```

**Output**

```html
<head>
  ...
  <style>
    /* your scss files combines, compiled and minimified here */
  </style>
</head>
```

Notice that styles are hoisted to the head of the page.

## Live Examples

### The Masterful Speaker's Journey

- Source: https://github.com/hacknlove/tmsj/
- Live: https://tmsj.hacknlove.org/

It's a learning game for public speaking.

## Status

Filar is still being prototyped, and you should not use it in production.

You can play with it, and contribute with code or ideas.

## Roadmap

- [ ] Client Elements
- [ ] Server directives
- [ ] API endpoints
- [ ] Builder for dynamic sites
- [ ] More examples
- [ ] Tutorials
- [ ] Deploy static site GitHub pages
- [ ] Deploy static site to Cloudflare
- [ ] Deploy dynamic site to Cloudflare

## Requests and Suggestions

Please use GitHub issues to request features, give feedback and suggestions, and to report bugs.
