/**
 * CSS Management Library for Modular Style Registration - React TypeScript Version
 * @module CssManagementReact
 */

import React, { ReactElement, useEffect, useRef } from 'react';

/**
 * Custom error for style-related issues
 */
export class StyleError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StyleError';
  }
}

/**
 * Style Registry for managing CSS styles for collections of elements
 */
export class StyleRegistry {
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
   * Register styles for a component's collection of elements
   * @param styles - Array of CSS property names
   * @param cssclasses - Array of class names (minimum 2 for collections)
   * @param cssvalues - Array of comma-separated value strings
   * @param prefix - Component-specific prefix
   * @returns Array of indexes mapping to centralized styles
   */
  register(styles: string[], cssclasses: string[], cssvalues: string[], prefix: string): number[] {
    if (!prefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(prefix)) {
      throw new StyleError('Component prefix must be a valid alphanumeric string', 'INVALID_PREFIX');
    }
    if (cssclasses.length < 2) {
      throw new StyleError(
        'At least 2 cssclasses are required for collections-based styling',
        'INSUFFICIENT_CLASSES'
      );
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

    this.injectStyles();
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
    this.injectStyles();
  }

  /**
   * Clear all styles
   */
  clearAll(): void {
    this.styleMap.clear();
    this.styles.length = 0;
    const styleElement = document.getElementById(this.styleElementId);
    if (styleElement) {
      styleElement.remove();
    }
  }

  /**
   * Inject styles into the DOM
   */
  private injectStyles(): void {
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

    // Remove existing style element
    const existingElement = document.getElementById(this.styleElementId);
    if (existingElement) {
      existingElement.remove();
    }

    // Create and inject new style element
    const styleElement = document.createElement('style');
    styleElement.id = this.styleElementId;
    styleElement.textContent = cssRules;
    document.head.appendChild(styleElement);
  }
}

/**
 * React Hook for using StyleRegistry
 */
export function useStyleRegistry(appPrefix: string, nullValue: string = 'inherit'): StyleRegistry {
  const registryRef = useRef<StyleRegistry>();
  
  if (!registryRef.current) {
    registryRef.current = new StyleRegistry(appPrefix, nullValue);
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      registryRef.current?.clearAll();
    };
  }, []);

  return registryRef.current;
}

/**
 * Base Component interface for style registration for collections of elements
 */
export interface ComponentStyleConfig {
  styles: string[];
  cssclasses: string[];
  cssvalues: string[];
  prefix: string;
}

/**
 * Base Component class for style registration for collections of elements
 */
export abstract class Component {
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
    if (this.cssclasses.length < 2) {
      throw new StyleError(
        'At least 2 cssclasses are required for collections-based styling',
        'INSUFFICIENT_CLASSES'
      );
    }
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
  abstract render(): ReactElement;
}

/**
 * React Hook Component for collections-based styling
 */
export function useComponentStyles(config: ComponentStyleConfig, registry: StyleRegistry) {
  const { styles, cssclasses, cssvalues, prefix } = config;
  const reindexedStylesRef = useRef<number[]>();

  useEffect(() => {
    if (!prefix || !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(prefix)) {
      throw new StyleError('Component prefix must be a valid alphanumeric string', 'INVALID_PREFIX');
    }
    if (cssclasses.length < 2) {
      throw new StyleError(
        'At least 2 cssclasses are required for collections-based styling',
        'INSUFFICIENT_CLASSES'
      );
    }

    reindexedStylesRef.current = registry.register(styles, cssclasses, cssvalues, prefix);

    return () => {
      registry.removeStyles(prefix);
    };
  }, [styles, cssclasses, cssvalues, prefix, registry]);

  const getClassName = (className: string): string => {
    const index = cssclasses.indexOf(className);
    if (index === -1) {
      throw new StyleError(`Class name '${className}' not found`, 'CLASS_NOT_FOUND');
    }
    return registry.getClassName(prefix, className);
  };

  return {
    getClassName,
    reindexedStyles: reindexedStylesRef.current || []
  };
}

/**
 * Card React component with 4 labels and 3 buttons
 */
export class CardComponent extends Component {
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

  render(): ReactElement {
    return (
      <div className="card">
        {Array.from({ length: 4 }, (_, i) => {
          const className = i % 2 === 0 ? 'label-primary' : 'label-secondary';
          return (
            <label key={`label-${i}`} className={this.getClassName(className)}>
              Label {i + 1}
            </label>
          );
        })}
        {Array.from({ length: 3 }, (_, i) => {
          const className = i % 2 === 0 ? 'button-primary' : 'button-secondary';
          return (
            <button key={`button-${i}`} className={this.getClassName(className)}>
              Button {i + 1}
            </button>
          );
        })}
      </div>
    );
  }
}

/**
 * Functional React Card component using hooks
 */
export interface CardProps {
  registry: StyleRegistry;
}

export const Card: React.FC<CardProps> = ({ registry }) => {
  const config: ComponentStyleConfig = {
    styles: [
      'background-color', // Button-exclusive
      'border',          // Button-exclusive
      'color',          // Label-exclusive
      'margin',         // Label-exclusive
      'font-size',      // Shared
      'padding',        // Shared
      'font-family'     // Shared
    ],
    cssclasses: ['button-primary', 'button-secondary', 'label-primary', 'label-secondary'],
    cssvalues: [
      `blue,1px solid black,null,null,16px,10px,Arial`, // button-primary
      `red,1px solid gray,null,null,14px,8px,Arial`,   // button-secondary
      `null,null,black,5px,16px,5px,Arial`,           // label-primary
      `null,null,gray,3px,14px,3px,Arial`            // label-secondary
    ],
    prefix: 'form1'
  };

  const { getClassName } = useComponentStyles(config, registry);

  return (
    <div className="card">
      {Array.from({ length: 4 }, (_, i) => {
        const className = i % 2 === 0 ? 'label-primary' : 'label-secondary';
        return (
          <label key={`label-${i}`} className={getClassName(className)}>
            Label {i + 1}
          </label>
        );
      })}
      {Array.from({ length: 3 }, (_, i) => {
        const className = i % 2 === 0 ? 'button-primary' : 'button-secondary';
        return (
          <button key={`button-${i}`} className={getClassName(className)}>
            Button {i + 1}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Example usage component
 */
export const ExampleApp: React.FC = () => {
  const registry = useStyleRegistry('myApp');

  return (
    <div>
      <Card registry={registry} />
    </div>
  );
};
