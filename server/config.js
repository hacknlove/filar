module.exports = {
    from: process.env.FROM || process.cwd(),
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    watch: process.env.WATCH || false,
    livereload: process.env.LIVERELOAD || false,
    ... JSON.parse(process.env.CONFIG || '{}')
}