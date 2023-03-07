function isAModule(src) {
    try {
        require.resolve(src);
        return true;
    } catch (error) {
        return false;
    }
}

exports.isAModule = isAModule;