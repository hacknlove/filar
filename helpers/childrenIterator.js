// Iterates through children yielding each child and its index

function* childrenIterator(element) {
  let current = element.firstChild;
  while (current) {
    const next = current.nextSibling;
    yield current;
    current = next;
  }
}

function* childrenDeepIterator(element) {
  let current = element.firstChild;
  while (current) {
    if (current.firstChild) {
      for (const child of childrenDeepIterator(current)) {
        yield child;
      }
    }
    const next = current.nextSibling;
    yield current;
    current = next;
  }
}

exports.childrenDeepIterator = childrenDeepIterator;
exports.childrenIterator = childrenIterator;
