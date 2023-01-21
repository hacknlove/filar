function status(req, res, node) {
    res.status(parseInt(node.getAttribute('code')));
}

exports.status = status;