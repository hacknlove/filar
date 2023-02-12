const { DOMParser } = require("linkedom");
const parser = new DOMParser();

const { prepareSSR } = require("./prepareSSR");

describe("prepareSSR", () => {
  it("adds a script tag with the context", () => {
    const node = parser.parseFromString("<SSR>{{Title}}</SSR>").firstChild;

    const context = {
      Title: "old title",
    };

    prepareSSR(node, context);

    expect(node.toString()).toMatchSnapshot();
  });

  it("skips the script tag if it already exists", () => {
    const node = parser.parseFromString(
      "<SSR><script type='application/json' class='ssr'></script>{{title}}</SSR>"
    ).firstChild;

    const context = {
      title: "old title",
    };

    prepareSSR(node, context);

    expect(node.toString()).toMatchSnapshot();
  });
});
