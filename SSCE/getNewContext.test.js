const { getNewContext } = require("./getNewContext");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("getNewContext", () => {
    it("should return the context with the new attributes", () => {
        const node = parser.parseFromString("<div Title='new title' FooBar='bar'></div>").firstChild;

        const context = {
            Title: "old title",
        };

        const newContext = getNewContext(node, context);

        expect(newContext).toEqual({
            Title: "new title",
            FooBar: "bar",
        });
    });
});