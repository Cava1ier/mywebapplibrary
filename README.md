# MyHTML5 Library

A lightweight JavaScript library for building dynamic web applications with a powerful CSS-in-JS style management system, component architecture, and module loading capabilities.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Features](#core-features)
- [StyleRegistry - The Heart of MyHTML5](#styleregistry---the-heart-of-myhtml5)
- [Component System](#component-system)
- [Module Management](#module-management)
- [DOM Utilities](#dom-utilities)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Browser Support](#browser-support)

## Overview

MyHTML5 is a comprehensive JavaScript library that provides:

- **Dynamic CSS Management**: Programmatically generate and inject CSS styles
- **Component Architecture**: Build reusable UI components with state management
- **Module Loading**: Lazy loading and dependency management for better performance
- **DOM Utilities**: Simplified DOM manipulation and element creation

## Installation

### Browser (Global)
```html
<script src="mywebapp.js"></script>
<script>
  const { StyleRegistry, Component } = MyHTML5;
</script>
```

### CommonJS
```javascript
const MyHTML5 = require('./mywebapp.js');
const { StyleRegistry, Component } = MyHTML5;
```

### AMD
```javascript
define(['MyHTML5'], function(MyHTML5) {
  const { StyleRegistry, Component } = MyHTML5;
});
```

## Core Features

### 🎨 Dynamic Style Management
Generate CSS classes programmatically with the StyleRegistry system

### 🧩 Component-Based Architecture
Build reusable components with props and state management

### 📦 Module Loading
Lazy load modules and manage dependencies efficiently

### 🏭 Factory Patterns
Create components dynamically with factory methods

## StyleRegistry - The Heart of MyHTML5

The StyleRegistry is the most powerful feature of MyHTML5, enabling dynamic CSS generation and management. It allows you to programmatically create CSS classes with consistent naming conventions and automatic style injection.

### Basic Concept

The StyleRegistry works by:
1. Registering style definitions with class prefixes
2. Automatically generating CSS rules
3. Injecting styles into the document head
4. Providing methods to reference the generated class names

### Creating a StyleRegistry

```javascript
const styleRegistry = new MyHTML5.StyleRegistry('myapp');
```

The constructor requires an `appPrefix` parameter that ensures your styles don't conflict with other libraries or applications.

### Adding Style Classes

```javascript
// Define CSS properties
const styles = ['color', 'font-size', 'background-color', 'padding'];

// Define class names
const classnames = ['primary', 'secondary', 'large', 'small'];

// Define values for each class (must match styles array length)
const styleValues = [
  ['#007bff', '16px', '#ffffff', '12px'],  // primary
  ['#6c757d', '14px', '#f8f9fa', '8px'],   // secondary
  ['#333333', '24px', '#e9ecef', '16px'],  // large
  ['#666666', '12px', '#ffffff', '4px']    // small
];

// Register the style group
const buttonStyles = styleRegistry.addClassPrefix('btn', styles, classnames, styleValues);
```

### Using Generated Classes

```javascript
// Get the full CSS class name
const primaryButtonClass = styleRegistry.cls('btn', 'primary');
// Returns: "myapp-btn-primary"

// Apply to an element
element.className = primaryButtonClass;
```

### Advanced StyleRegistry Features

#### 1. Multiple Style Groups

```javascript
// Button styles
styleRegistry.addClassPrefix('btn', 
  ['color', 'background-color', 'border-radius'],
  ['primary', 'danger', 'success'],
  [
    ['white', '#007bff', '4px'],
    ['white', '#dc3545', '4px'],
    ['white', '#28a745', '4px']
  ]
);

// Layout styles
styleRegistry.addClassPrefix('layout',
  ['display', 'flex-direction', 'align-items'],
  ['flex-row', 'flex-col', 'center'],
  [
    ['flex', 'row', 'stretch'],
    ['flex', 'column', 'stretch'],
    ['flex', 'row', 'center']
  ]
);
```

#### 2. Dynamic Style Updates

```javascript
// Get the class registry for a specific prefix
const btnRegistry = styleRegistry.registries.get('btn');

// Update styles dynamically
btnRegistry.updateStyles(
  ['color', 'background-color', 'border', 'padding'],
  ['primary', 'secondary'],
  [
    ['white', '#0056b3', '2px solid #004085', '10px 20px'],
    ['#333', '#e9ecef', '1px solid #dee2e6', '8px 16px']
  ]
);
```

#### 3. Style Management Methods

```javascript
// Get all registered prefixes
const prefixes = styleRegistry.getRegisteredPrefixes();
console.log(prefixes); // ['btn', 'layout']

// Remove a specific style group
styleRegistry.removeClassPrefix('btn');

// Clear all styles
styleRegistry.clearAll();
```

### Null Values and Conditional Styles

The StyleRegistry supports `null` values to conditionally omit CSS properties:

```javascript
const styles = ['color', 'font-weight', 'text-decoration'];
const classnames = ['link', 'button-text', 'disabled'];
const styleValues = [
  ['#007bff', null, 'underline'],        // link: only color and text-decoration
  ['#333333', 'bold', null],             // button-text: only color and font-weight  
  ['#999999', null, null]                // disabled: only color
];
```

### Real-World Example: Responsive Button System

```javascript
const app = new MyHTML5.StyleRegistry('webapp');

// Define comprehensive button system
const buttonProperties = [
  'padding', 'font-size', 'font-weight', 'border-radius',
  'border', 'background-color', 'color', 'cursor',
  'transition', 'box-shadow'
];

const buttonClasses = ['sm', 'md', 'lg', 'primary', 'secondary', 'danger'];

const buttonValues = [
  // sm
  ['8px 16px', '14px', '400', '4px', 'none', '#f8f9fa', '#333', 'pointer', 'all 0.2s', 'none'],
  // md  
  ['12px 24px', '16px', '400', '6px', 'none', '#f8f9fa', '#333', 'pointer', 'all 0.2s', 'none'],
  // lg
  ['16px 32px', '18px', '400', '8px', 'none', '#f8f9fa', '#333', 'pointer', 'all 0.2s', 'none'],
  // primary
  ['12px 24px', '16px', '500', '6px', 'none', '#007bff', 'white', 'pointer', 'all 0.2s', '0 2px 4px rgba(0,123,255,0.2)'],
  // secondary
  ['12px 24px', '16px', '400', '6px', '1px solid #dee2e6', 'white', '#333', 'pointer', 'all 0.2s', 'none'],
  // danger
  ['12px 24px', '16px', '500', '6px', 'none', '#dc3545', 'white', 'pointer', 'all 0.2s', '0 2px 4px rgba(220,53,69,0.2)']
];

app.addClassPrefix('button', buttonProperties, buttonClasses, buttonValues);

// Usage in HTML creation
const createButton = (text, size = 'md', variant = 'primary') => {
  const button = document.createElement('button');
  button.className = `${app.cls('button', size)} ${app.cls('button', variant)}`;
  button.textContent = text;
  return button;
};

// Create buttons
const saveButton = createButton('Save', 'lg', 'primary');
const cancelButton = createButton('Cancel', 'md', 'secondary');
```

## Component System

Build reusable components that integrate seamlessly with the StyleRegistry:

```javascript
class Button extends MyHTML5.Component {
  constructor(styleRegistry, props = {}) {
    super(styleRegistry, 'button', props);
  }

  render() {
    const { text, size = 'md', variant = 'primary', onClick } = this.props;
    
    return MyHTML5.DOMFactory.createElement({
      tag: 'button',
      className: `${this.cls(size)} ${this.cls(variant)}`,
      attributes: { textContent: text },
      events: { click: onClick }
    });
  }
}

// Usage
const button = new Button(styleRegistry, {
  text: 'Click Me',
  size: 'lg',
  variant: 'primary',
  onClick: () => console.log('Button clicked!')
});
```

## Module Management

### Import Registry

```javascript
const importRegistry = MyHTML5.ImportRegistry.getInstance();

importRegistry.register({
  alias: 'utils',
  path: './utils.js',
  dependencies: ['lodash']
});

// Lazy load modules
const utils = await importRegistry.resolve('utils');
```

### Component Factory

```javascript
const factory = MyHTML5.ComponentFactory.getInstance();

factory.register('button', Button);
factory.registerVariant('button', 'icon', IconButton);

// Create components dynamically
const button = factory.create({
  type: 'button',
  variant: 'icon',
  props: { icon: 'save', text: 'Save' }
});
```

## DOM Utilities

Simplified DOM element creation:

```javascript
const element = MyHTML5.DOMFactory.createElement({
  tag: 'div',
  className: 'container',
  attributes: { id: 'main-content' },
  events: { click: handleClick },
  children: [
    { tag: 'h1', attributes: { textContent: 'Hello World' } },
    { tag: 'p', attributes: { textContent: 'Welcome to MyHTML5' } }
  ]
});
```

## Examples

### Complete Application Example

```javascript
// Initialize the application
const app = new MyHTML5.StyleRegistry('todoapp');

// Define styles
app.addClassPrefix('container', ['max-width', 'margin', 'padding'], ['main'], [['800px', '0 auto', '20px']]);
app.addClassPrefix('item', ['padding', 'border-bottom', 'display'], ['todo'], [['10px', '1px solid #eee', 'flex']]);

// Create a todo component
class TodoItem extends MyHTML5.Component {
  constructor(styleRegistry, props) {
    super(styleRegistry, 'item', props);
  }

  render() {
    const { text, completed, onToggle } = this.props;
    
    return MyHTML5.DOMFactory.createElement({
      tag: 'div',
      className: this.cls('todo'),
      children: [
        {
          tag: 'input',
          attributes: { type: 'checkbox', checked: completed },
          events: { change: onToggle }
        },
        {
          tag: 'span',
          attributes: { textContent: text }
        }
      ]
    });
  }
}

// Use the component
const todoItem = new TodoItem(app, {
  text: 'Learn MyHTML5',
  completed: false,
  onToggle: () => console.log('Todo toggled!')
});

document.body.appendChild(todoItem.render());
```

## API Reference

### StyleRegistry

| Method | Parameters | Description |
|--------|------------|-------------|
| `constructor(appPrefix)` | `appPrefix: string` | Creates a new StyleRegistry with the given app prefix |
| `addClassPrefix(classPrefix, styles, classnames, styleValues)` | `classPrefix: string, styles: string[], classnames: string[], styleValues: any[][]` | Registers a new class prefix with styles |
| `cls(classPrefix, className)` | `classPrefix: string, className: string` | Returns the full CSS class name |
| `removeClassPrefix(classPrefix)` | `classPrefix: string` | Removes a registered class prefix |
| `getRegisteredPrefixes()` | - | Returns array of registered prefixes |
| `clearAll()` | - | Removes all registered styles |

### Component

| Method | Parameters | Description |
|--------|------------|-------------|
| `constructor(styleRegistry, classPrefix, props)` | `styleRegistry: StyleRegistry, classPrefix: string, props: object` | Creates a new component |
| `cls(className)` | `className: string` | Returns styled class name using component's prefix |
| `render()` | - | Must be implemented by subclass |
| `setState(newState, callback)` | `newState: object, callback?: function` | Updates component state |

## Browser Support

- Modern browsers supporting ES6+ features
- Internet Explorer 11+ (with polyfills)
- All major mobile browsers

## Contributing

MyHTML5 is designed to be extensible. You can:
- Add new component types
- Extend the StyleRegistry with custom features
- Create specialized factory classes
- Build domain-specific modules

---

**MyHTML5** - Building dynamic web applications with style and structure.
