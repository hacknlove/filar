const { processAllElements } = require("./processAllElements");

const { DOMParser } = require("linkedom");
const parser = new DOMParser();

const { ServerElementsMap } = require("../se/common");
const { createFakeContext } = require("../../test/fakeContext");

describe("processAllElements", () => {
  it("replaces the context in texts", async () => {
    const html = `
<html Title="'My title'">
  <head>
    <title>{{Title}}</title>
  </head>
  <body>
  </body>
</html>
`;
    const document = parser.parseFromString(html);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });

  it("does not replaces the context in text for SSR", async () => {
    const html = `
  <html Title="'My title'">
    <head>
      <title>{{Title}}</title>
    </head>
    <body>
      <SSR>
        <h1>{{Title}}</h1>
      </SSR>
    </body>
  </html>
  `;
    const document = parser.parseFromString(html);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });

  it("skips comments", async () => {
    const html = `
  <html Title="'My title'">
    <body>
      <!-- <h1>{{Title}}</h1> -->
    </body>
  </html>
  `;
    const document = parser.parseFromString(html);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });

  it("replaces text in atrributes", async () => {
    const html = `
      <div AltText="'My title'" ImgSrc="'/img.jpg'">
        <img src={{ImgSrc}} alt={{AltText}}>
      </div>
    `;

    const document = parser.parseFromString(html);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });

  it("evaluates expressions in text nodes and attributes", async () => {
    const html = `
      <div Title="'My title'">
        <a href="/{{Title.replaceAll(' ', '-')}}">{{Title.toUpperCase()}}</a>
      </div>
    `;

    const document = parser.parseFromString(html);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });

  it("processes custom elements", async () => {
    const html = `
      <div Title="'My title'">
        <MyComponent Title="'Title'" Content="'Lorem Ipsum'" Href="'/some-page'">
          <h1 slot="title">{{Title}}</h1>
          <p slot="content">{{Content}}</p>
          some text without slot
          <p>some text without slot</p>
        </MyComponent>
      </div>
    `;

    const MyComponent = `
      <div>
        <header>
          <slot name="title"></slot>
        </header>
        <main>
          <slot name="content"></slot>
        </main>
        <aside>
          <slot></slot>
        </aside>
        <footer>
          <a href={{Href}}>Go to page</a>
        </footer>
      </div>
    `;

    const document = parser.parseFromString(html);
    const myComponent = parser.parseFromString(MyComponent).firstElementChild;

    ServerElementsMap.set("MyComponent", myComponent);

    await processAllElements(document, createFakeContext());

    expect(document.toString()).toMatchSnapshot();
  });
});
