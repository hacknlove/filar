#!/usr/bin/env node

const command = process.argv[2];

try {
    require(`./command-${command}`);
} catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
        throw error;
    }
    console.error("Unknown command:", command);
    require("./command-help");
    return
}