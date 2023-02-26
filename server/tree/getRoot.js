exports.getRoot = function getRoot(element) {
  while (element.parentElement) {
    element = element.parentElement;
  }
  return element;
};
