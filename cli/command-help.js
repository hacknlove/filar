console.info(`
filar version ${
  require("../package.json").version
} Not suitable for production use.

Usage: filar <command> [options]

Commands:
    dev    Start a development server
    static Build a static site
    help   Show this help message

Options:
    --from <path>   Source directory (default: ${process.cwd()})
    --port <port>   Port to listen on (default: 3000) Only for dev
    --host <host>   Host to listen on (default: localhost) Only for dev

    Any other option will be included into the config object, which is accesible in the context.

Environment variables:
    FROM    same as --from
    PORT    same as --port
    HOST    same as --host
    CONFIG  JSON string to override any option, e.g. '{"port": 8080}', and to set defaults for the context.

More information:
https://github.com/hacknlove/filar
`);
