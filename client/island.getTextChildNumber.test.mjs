import { __test__ } from "./island.mjs";

const { getTextChildNumber } = __test__;

describe("getTextChildNumber", () => {
  it("returns the correct number of text node siblings", () => {
    const div = document.createElement("div");
    div.innerHTML = "Text1<span></span>Text2<span></span>Text3";
    const firstChild = div.firstChild;
    const secondTextNode = firstChild.nextSibling.nextSibling;

    expect(getTextChildNumber(firstChild)).toBe(0);
    expect(getTextChildNumber(secondTextNode)).toBe(1);
  });

  it("returns 0 when there are no text node siblings", () => {
    const div = document.createElement("div");
    div.innerHTML = "<span></span>Text1";
    const firstTextNode = div.firstChild.nextSibling;

    expect(getTextChildNumber(firstTextNode)).toBe(0);
  });
});
