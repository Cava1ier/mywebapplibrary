/**
 * Modular Style Registry and DOM Handler for React Applications
 * @module StyleRegistry
 */

import { logger } from './utils'; // Assume a simple logger utility

/**
 * Custom error for StyleRegistry-specific issues
 */
class StyleRegistryError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StyleRegistryError';
  }
}

/**
 * Configuration for registering styles in a component
 */
interface StyleConfig {
  styles: string[]; // Array of CSS property names (e.g., ['background-color', 'font-size'])
  cssclasses: string[]; // Array of meaningful class names (e.g., ['primary', 'secondary'])
  cssvalues: string[][]; // Array of value arrays (e.g., [['blue', '16px'], ['red', '14px']])
  prefix: string; // Component-specific prefix (e.g., 'form1')
}

/**
 * Base Component class for style registration
 * @abstract
 */
abstract class Component {
  protected styles: string[] = [];
  protected cssclasses: string[] = [];
  protected cssvalues: string[][] = [];
  protected reindexedstyles: number[] = [];
  protected prefix: string;

  constructor(prefix: string) {
    if (!prefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(prefix)) {
      throw new StyleRegistryError('Component prefix must be a valid alphanumeric string', 'INVALID_PREFIX');
    }
    this.prefix = prefix;
  }

  /**
   * Register styles with the StyleRegistry
   * @param registry - The StyleRegistry instance
   */
  protected registerStyles(registry: StyleRegistry): void {
    this.validateStyles();
    this.reindexedstyles = registry.register(this.styles, this.cssclasses, this.cssvalues, this.prefix);
  }

  /**
   * Validate styles, cssclasses, and cssvalues arrays
   */
  private validateStyles(): void {
    if (this.cssclasses.length !== this.cssvalues.length) {
      throw new StyleRegistryError(
        `cssclasses (${this.cssclasses.length}) and cssvalues (${this.cssvalues.length}) must have the same length`,
        'INVALID_STYLE_CONFIG'
      );
    }
    this.cssvalues.forEach((values, index) => {
      if (values.length !== this.styles.length) {
        throw new StyleRegistryError(
          `cssvalues[${index}] length (${values.length}) must match styles length (${this.styles.length})`,
          'INVALID_STYLE_VALUES'
        );
      }
    });
  }

  /**
   * Get the class name for a given cssclass
   * @param className - The class name (e.g., 'primary')
   */
  protected getClassName(className: string): string {
    const index = this.cssclasses.indexOf(className);
    if (index === -1) {
      throw new StyleRegistryError(`Class name '${className}' not found`, 'CLASS_NOT_FOUND');
    }
    return `${this.prefix}-${className}`;
  }

  /**
   * Abstract render method to be implemented by subclasses
   */
  abstract render(): HTMLElement;
}

/**
 * Style Registry for managing CSS styles with a centralized property array
 * @class StyleRegistry
 */
/**
 * CSS Management Library for Modular Style Registration
 * @module CssManagement
 */

/**
 * Custom error for style-related issues
 */
class StyleError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StyleError';
  }
}

/**
 * Style Registry for managing CSS styles with a centralized property array
 * @class StyleRegistry
 */
class StyleRegistry {
  private readonly appPrefix: string;
  private readonly nullValue: string;
  private readonly styles: string[] = []; // Centralized unique CSS property names
  private readonly styleMap = new Map<string, Map<string, string[]>>(); // prefix -> className -> values
  private readonly styleElementId: string;

  /**
   * Initialize StyleRegistry with an application prefix and null value
   * @param appPrefix - Application-wide prefix (e.g., 'myApp')
   * @param nullValue - Value for non-applicable properties (default: 'inherit')
   */
  constructor(appPrefix: string, nullValue: string = 'inherit') {
    if (!appPrefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(appPrefix)) {
      throw new StyleError('Application prefix must be a valid alphanumeric string', 'INVALID_APP_PREFIX');
    }
    this.appPrefix = appPrefix;
    this.nullValue = nullValue;
    this.styleElementId = `${appPrefix}-styles`;
  }

  /**
   * Register styles for a component
   * @param styles - Array of CSS property names
   * @param cssclasses - Array of class names
   * @param cssvalues - Array of comma-separated value strings
   * @param prefix - Component-specific prefix
   * @returns Array of indexes mapping to centralized styles
   */
  register(styles: string[], cssclasses: string[], cssvalues: string[], prefix: string): number[] {
    if (!prefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(prefix)) {
      throw new StyleError('Component prefix must be a valid alphanumeric string', 'INVALID_PREFIX');
    }
    if (cssclasses.length !== cssvalues.length) {
      throw new StyleError(
        `cssclasses (${cssclasses.length}) and cssvalues (${cssvalues.length}) must have the same length`,
        'INVALID_STYLE_CONFIG'
      );
    }
    cssvalues.forEach((valueStr, index) => {
      const values = valueStr.split(',');
      if (values.length !== styles.length) {
        throw new StyleError(
          `cssvalues[${index}] length (${values.length}) must match styles length (${styles.length})`,
          'INVALID_STYLE_VALUES'
        );
      }
    });

    const indexes: number[] = styles.map(prop => {
      const index = this.styles.indexOf(prop);
      if (index === -1) {
        this.styles.push(prop);
        return this.styles.length - 1;
      }
      return index;
    });

    const classMap = new Map<string, string[]>();
    cssclasses.forEach((className, index) => {
      const values = cssvalues[index].split(',').map(value => value || this.nullValue);
      classMap.set(className, values);
    });
    this.styleMap.set(prefix, classMap);

    this.#injectStyles();
    return indexes;
  }

  /**
   * Get the centralized styles array
   */
  getStyles(): string[] {
    return [...this.styles];
  }

  /**
   * Get the full class name for a component
   * @param prefix - Component prefix
   * @param className - Class name
   */
  getClassName(prefix: string, className: string): string {
    if (!this.styleMap.has(prefix)) {
      throw new StyleError(`Prefix '${prefix}' not registered`, 'PREFIX_NOT_FOUND');
    }
    if (!this.styleMap.get(prefix)!.has(className)) {
      throw new StyleError(`Class name '${className}' not found for prefix '${prefix}'`, 'CLASS_NOT_FOUND');
    }
    return `${this.appPrefix}-${prefix}-${className}`;
  }

  /**
   * Remove styles for a component
   * @param prefix - Component prefix
   */
  removeStyles(prefix: string): void {
    this.styleMap.delete(prefix);
    this.#injectStyles();
  }

  /**
   * Clear all styles
   */
  clearAll(): void {
    this.styleMap.clear();
    this.styles.length = 0;
    const styleElement = DOMHandler.getElementById(this.styleElementId);
    if (styleElement) {
      DOMHandler.removeElement(styleElement);
    }
  }

  /**
   * Inject styles into the DOM
   */
  #injectStyles(): void {
    let cssRules = '';
    for (const [prefix, classMap] of this.styleMap) {
      for (const [className, values] of classMap) {
        const fullClass = `.${this.appPrefix}-${prefix}-${className}`;
        cssRules += `${fullClass} {\n`;
        values.forEach((value, index) => {
          if (value !== this.nullValue) {
            const property = this.styles[index];
            cssRules += `  ${property}: ${value};\n`;
          }
        });
        cssRules += '}\n';
      }
    }

    const styleElement = DOMHandler.createElement('style', {
      id: this.styleElementId,
      textContent: cssRules
    });
    DOMHandler.appendChild(document.head, styleElement);
  }
}

/**
 * DOM manipulation utilities
 * @class DOMHandler
 */
class DOMHandler {
  /**
   * Create a DOM element
   * @param tag - HTML tag name
   * @param attributes - Element attributes
   */
  static createElement(tag: string, attributes: Record<string, string> = {}): HTMLElement {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'textContent') {
        element.textContent = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  /**
   * Append a child to a parent element
   * @param parent - Parent element
   * @param child - Child element or text
   */
  static appendChild(parent: HTMLElement, child: HTMLElement | string): HTMLElement {
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else {
      parent.appendChild(child);
    }
    return parent;
  }

  /**
   * Get element by ID
   * @param id - Element ID
   */
  static getElementById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  /**
   * Remove an element from the DOM
   * @param element - Element to remove
   */
  static removeElement(element: HTMLElement | null): void {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

/**
 * Base Component class for style registration
 * @abstract
 */
abstract class Component {
  protected styles: string[] = [];
  protected cssclasses: string[] = [];
  protected cssvalues: string[] = []; // Comma-separated value strings
  protected reindexedstyles: number[] = [];
  protected prefix: string;
  protected registry: StyleRegistry;
  protected nl = null; // Null value for non-applicable properties

  /**
   * Initialize Component with a prefix and StyleRegistry
   * @param prefix - Component-specific prefix
   * @param registry - Shared StyleRegistry instance
   */
  constructor(prefix: string, registry: StyleRegistry) {
    if (!prefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(prefix)) {
      throw new StyleError('Component prefix must be a valid alphanumeric string', 'INVALID_PREFIX');
    }
    if (!registry) {
      throw new StyleError('StyleRegistry is required', 'INVALID_REGISTRY');
    }
    this.prefix = prefix;
    this.registry = registry;
  }

  /**
   * Register styles with the StyleRegistry
   */
  protected registerStyles(): void {
    this.validateStyles();
    this.reindexedstyles = this.registry.register(this.styles, this.cssclasses, this.cssvalues, this.prefix);
  }

  /**
   * Validate styles, cssclasses, and cssvalues
   */
  private validateStyles(): void {
    if (this.cssclasses.length !== this.cssvalues.length) {
      throw new StyleError(
        `cssclasses (${this.cssclasses.length}) and cssvalues (${this.cssvalues.length}) must have the same length`,
        'INVALID_STYLE_CONFIG'
      );
    }
    this.cssvalues.forEach((valueStr, index) => {
      const values = valueStr.split(',');
      if (values.length !== this.styles.length) {
        throw new StyleError(
          `cssvalues[${index}] length (${values.length}) must match styles length (${this.styles.length})`,
          'INVALID_STYLE_VALUES'
        );
      }
    });
  }

  /**
   * Get the class name for a given cssclass
   * @param className - The class name (e.g., 'primary')
   */
  protected getClassName(className: string): string {
    const index = this.cssclasses.indexOf(className);
    if (index === -1) {
      throw new StyleError(`Class name '${className}' not found`, 'CLASS_NOT_FOUND');
    }
    return this.registry.getClassName(this.prefix, className);
  }

  /**
   * Abstract render method to be implemented by subclasses
   */
  abstract render(): HTMLElement;
}

/**
 * Card component with 4 labels and 3 buttons
 * @class Card
 */
class Card extends Component {
  constructor(registry: StyleRegistry) {
    super('form1', registry);
    this.styles = [
      'background-color', // Button-exclusive
      'border',          // Button-exclusive
      'color',          // Label-exclusive
      'margin',         // Label-exclusive
      'font-size',      // Shared
      'padding',        // Shared
      'font-family'     // Shared
    ];
    this.cssclasses = ['button-primary', 'button-secondary', 'label-primary', 'label-secondary'];
    this.cssvalues = [
      `blue,1px solid black,${this.nl},${this.nl},16px,10px,Arial`, // button-primary
      `red,1px solid gray,${this.nl},${this.nl},14px,8px,Arial`,   // button-secondary
      `${this.nl},${this.nl},black,5px,16px,5px,Arial`,           // label-primary
      `${this.nl},${this.nl},gray,3px,14px,3px,Arial`            // label-secondary
    ];
    this.registerStyles();
  }

  render(): HTMLElement {
    const card = DOMHandler.createElement('div', { class: 'card' });
    for (let i = 0; i < 4; i++) {
      const className = i % 2 === 0 ? 'label-primary' : 'label-secondary';
      const label = DOMHandler.createElement('label', {
        class: this.getClassName(className),
        textContent: `Label ${i + 1}`
      });
      DOMHandler.appendChild(card, label);
    }
    for (let i = 0; i < 3; i++) {
      const className = i % 2 === 0 ? 'button-primary' : 'button-secondary';
      const button = DOMHandler.createElement('button', {
        class: this.getClassName(className),
        textContent: `Button ${i + 1}`
      });
      DOMHandler.appendChild(card, button);
    }
    return card;
  }
}

/**
 * Exports for the module
 */
export { StyleRegistry, DOMHandler, Component, Card };

/**
 * Exports for the module
 */
export { StyleRegistry, DOMHandler, Component, Card };
