# MyHTML5

A modular, extensible JavaScript library for HTML5 component creation, style management, dynamic module loading, DOM creation, and more — all encapsulated to avoid global scope pollution.

## Features

- **StyleRegistry:** Manage CSS classes and inject styles dynamically.
- **ClassRegistry:** Register, update, and remove class-based styles.
- **Component:** Simple base class for creating UI components.
- **ImportRegistry:** Register and resolve dynamic module imports with dependencies.
- **ComponentFactory:** Register and instantiate components and their variants.
- **ModuleLoader:** Load and preload JavaScript modules dynamically.
- **ProviderWrapper:** Compose and apply context providers (middleware pattern).
- **DOMFactory:** Declaratively create DOM trees from JSON-like configs.

## Installation

Download or clone this repository, then add `myHTML5.js` to your project:

```html
<script src="myHTML5.js"></script>
```

Or, for Node/CommonJS:

```js
const MyHTML5 = require('./myHTML5');
```

## Quick Start

```js
// Initialize registries and factories
const styleRegistry = new MyHTML5.StyleRegistry('myApp');
const componentFactory = MyHTML5.ComponentFactory.getInstance();

// Add a style class
styleRegistry.addClassPrefix('button', ['background-color', 'color'], ['btn-primary'], [['blue', 'white']]);

// Use DOMFactory to build DOM elements declaratively
const myButtonConfig = {
    tag: 'button',
    className: styleRegistry.cls('button', 'btn-primary'),
    attributes: { textContent: 'Click Me' },
    events: {
        click: () => alert('Button clicked!')
    }
};
const buttonElement = MyHTML5.DOMFactory.createElement(myButtonConfig);
document.body.appendChild(buttonElement);

// Extend Component to create UI elements
class MyButton extends MyHTML5.Component {
    render() {
        return MyHTML5.DOMFactory.createElement({
            tag: 'button',
            className: this.cls('btn-primary'),
            attributes: { textContent: 'Click Me' }
        });
    }
}

// Create and mount the component
const myButton = new MyButton(styleRegistry, 'button');
document.body.appendChild(myButton.render());
```

## `DOMFactory` Reference

### `MyHTML5.DOMFactory.createElement(config)`

Create DOM nodes from plain objects:

**Example:**
```js
const dom = MyHTML5.DOMFactory.createElement({
    tag: 'div',
    className: 'container',
    attributes: { id: 'main', 'data-user': 'cava1ier' },
    children: [
        { tag: 'h1', attributes: { textContent: 'Hello World' } },
        { tag: 'button', attributes: { textContent: 'Click me' } }
    ]
});
// Appends the full structure to the DOM
document.body.appendChild(dom);
```

- `tag`: HTML tag name (required)
- `className`: String of space-separated classes (optional)
- `attributes`: Key-value pairs for attributes (optional)
- `children`: Array of children (can nest configs or use strings)
- `events`: Object of event listeners (e.g., `{ click: handler }`)

---

## License

MIT
