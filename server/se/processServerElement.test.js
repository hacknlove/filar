const processServerElement = require("./processServerElement");
const { ServerElementsMap } = require("./common");

const { DOMParser } = require("linkedom");
const parser = new DOMParser();

describe("processServerElement", () => {
  it("replaces the element with the custom element", () => {
    const document = parser.parseFromString(
      `<div><CustomElement /></div>`
    ).firstElementChild;
    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`<div>custom element content</div>`)
        .firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });

  it("processes the children", () => {
    const document = parser.parseFromString(
      `<div><CustomElement /></div>`
    ).firstElementChild;
    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`<div>custom element content</div>`)
        .firstElementChild
    );

    const processElements = jest.fn();

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      processElements
    );

    expect(processElements).toHaveBeenCalled();
  });

  it("processes the js custom elements", () => {
    const document = parser.parseFromString(
      `<div><CustomElement /></div>`
    ).firstElementChild;
    ServerElementsMap.set("CustomElement", {
      processServerElement: jest.fn((component) =>
        component.parentNode.replaceChild(
          parser.parseFromString(`<div>processed custom element</div>`)
            .firstElementChild,
          component
        )
      ),
    });

    const processElements = jest.fn();

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      processElements
    );

    expect(
      ServerElementsMap.get("CustomElement").processServerElement
    ).toHaveBeenCalled();
    expect(document.toString()).toMatchSnapshot();
  });

  it("slot children", () => {
    const document = parser.parseFromString(`
      <div>
        <CustomElement>
          <div slot="slot1">slot1 content</div>
        </CustomElement>
      </div>
    `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
      <div>
        <slot name="slot1" />
      </div>
    `).firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });

  it("slot children into unnamed slot", () => {
    const document = parser.parseFromString(`
    <div>
      <CustomElement>
        <div>slot1 content</div>
      </CustomElement>
    </div>
  `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
    <div>
      <slot/>
    </div>
  `).firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });

  it("throws if slot not found", async () => {
    const document = parser.parseFromString(`
    <div>
      <CustomElement>
        <div slot="wrong-name">slot1 content</div>
      </CustomElement>
    </div>
  `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
    <div>
      <slot/>
    </div>
  `).firstElementChild
    );

    await expect(() =>
      processServerElement.processServerElement(
        document.querySelector("CustomElement"),
        {},
        () => {}
      )
    ).rejects.toThrow();
  });

  it("adds children to template if slot not found", () => {
    const document = parser.parseFromString(`
    <div>
      <CustomElement>
        <div>content</div>
      </CustomElement>
    </div>
  `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
    <div>
    </div>
  `).firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });

  it("duplicates child in multiple slots with the same name", async () => {
    const document = parser.parseFromString(`
    <div>
      <CustomElement>
        <div slot="slot1">slot1 content</div>
      </CustomElement>
    </div>
  `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
    <div>
      <h1>
        <slot name="slot1" />
      </h1>
      <h2>
        <slot name="slot1" />
      </h2>
    </div>
  `).firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });

  it("uses the default value of the slot if no child is provided", () => {
    const document = parser.parseFromString(`
      <div>
        <CustomElement />
      </div>
    `).firstElementChild;

    ServerElementsMap.set(
      "CustomElement",
      parser.parseFromString(`
      <div>
        <slot name="slot1">
          <p>default slot content</p>
          And some more content
        </slot>
      </div>
    `).firstElementChild
    );

    processServerElement.processServerElement(
      document.querySelector("CustomElement"),
      {},
      () => {}
    );

    expect(document.toString()).toMatchSnapshot();
  });
});
