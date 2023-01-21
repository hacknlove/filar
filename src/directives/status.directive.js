function status(req, res, node) {
    res.status(node.getAttribute('code'));
}

exports.status = status;