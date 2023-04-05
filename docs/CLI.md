# Filar CLI

## Installation

```bash
npm install -g filar
```

## Help

```bash
filar help
```

## Common Options

- `--from` - Path to the directory to serve. Default: `./`

Any unkown option will be added to the config object, which is accessible in the context as `config`.

**Example:**

```bash
filar dev --foo bar
```

```html
<!-- index.html -->
<p>{{ config.foo }}</p>
```

**Output:**

```html
<p>bar</p>
```

## Development

Runs a server with live-reload and file watching.

Go to the root of the project and run:

```bash
filar dev
```

### Specific Options:

- `--port` - Port to run the server on. Default: `3000`
- `--host` - Host to run the server on. Default: `localhost`

## Static

Builds the project and outputs it to the `./static` directory.

Errors when dynamic routes or SSR tag is found.

```bash
filar static
```
