# mywebapplibrary

A modular, extensible JavaScript library for HTML5 component creation, style management, dynamic module loading, and more — all encapsulated to avoid global scope pollution.

## Features

- **StyleRegistry:** Manage CSS classes and inject styles dynamically.
- **ClassRegistry:** Register, update, and remove class-based styles.
- **Component:** Simple base class for creating UI components.
- **ImportRegistry:** Register and resolve dynamic module imports with dependencies.
- **ComponentFactory:** Register and instantiate components and their variants.
- **ModuleLoader:** Load and preload JavaScript modules dynamically.
- **ProviderWrapper:** Compose and apply context providers (middleware pattern).

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

// Extend Component to create UI elements
class MyButton extends MyHTML5.Component {
    render() {
        const buttonClass = this.cls('btn-primary');
        const button = document.createElement('button');
        button.className = buttonClass;
        button.textContent = 'Click Me';
        return button;
    }
}

// Create and mount the component
const myButton = new MyButton(styleRegistry, 'button');
document.body.appendChild(myButton.render());
```

## License

MIT
