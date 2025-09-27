(function(global) {
    'use strict';

    class StyleRegistry {
        constructor(appPrefix) {
            if (!appPrefix) throw new Error('StyleRegistry requires an app prefix');
            this.appPrefix = appPrefix;
            this.registries = new Map();
            this.injectedStyles = new Set();
            this._styleElement = null;
        }

        addClassPrefix(classPrefix, styles = [], classnames = [], styleValues = []) {
            if (!classPrefix) throw new Error('Class prefix is required');
            if (this.registries.has(classPrefix)) {
                console.warn(`Class prefix '${classPrefix}' already registered. Overwriting.`);
            }
            const classRegistry = new ClassRegistry(this.appPrefix, classPrefix, styles, classnames, styleValues);
            this.registries.set(classPrefix, classRegistry);
            classRegistry.injectStyles();
            this.injectedStyles.add(classPrefix);
            return classRegistry;
        }

        cls(classPrefix, className) {
            const registry = this.registries.get(classPrefix);
            if (!registry) throw new Error(`Class prefix '${classPrefix}' not registered. Call addClassPrefix() first.`);
            return registry.cls(className);
        }

        removeClassPrefix(classPrefix) {
            const registry = this.registries.get(classPrefix);
            if (registry) {
                registry.removeStyles();
                this.registries.delete(classPrefix);
                this.injectedStyles.delete(classPrefix);
            }
        }

        getRegisteredPrefixes() {
            return Array.from(this.registries.keys());
        }

        clearAll() {
            for (const [classPrefix, registry] of this.registries) {
                registry.removeStyles();
            }
            this.registries.clear();
            this.injectedStyles.clear();
        }
    }

    class ClassRegistry {
        constructor(appPrefix, classPrefix, styles, classnames, styleValues) {
            this.appPrefix = appPrefix;
            this.classPrefix = classPrefix;
            this.styles = styles;
            this.classnames = classnames;
            this.styleValues = styleValues;
            this.nl = null;
            this._styleRegistry = new Map();
            this._styleElementId = `styles-${appPrefix}-${classPrefix}`;
            this._initialized = false;
            this._validateArrays();
        }

        _validateArrays() {
            if (this.classnames.length !== this.styleValues.length) {
                throw new Error(`Style Registry Error: classnames (${this.classnames.length}) and styleValues (${this.styleValues.length}) arrays must have same length`);
            }
            this.styleValues.forEach((values, index) => {
                if (values.length !== this.styles.length) {
                    throw new Error(`Style Registry Error: styleValues[${index}] length (${values.length}) must match styles length (${this.styles.length})`);
                }
            });
        }

        cls(className) {
            if (!this._initialized) this.injectStyles();
            const fullClass = `${this.appPrefix}-${this.classPrefix}-${className}`;
            return this._styleRegistry.get(className) || fullClass;
        }

        injectStyles() {
            if (this._initialized) return;
            let cssRules = '';
            this.classnames.forEach((className, classIndex) => {
                const fullClass = `${this.appPrefix}-${this.classPrefix}-${className}`;
                const values = this.styleValues[classIndex];
                let cssRule = `.${fullClass} {\n`;
                this.styles.forEach((property, propIndex) => {
                    const value = values[propIndex];
                    if (value !== null && value !== this.nl) cssRule += `${property}: ${value};\n`;
                });
                cssRule += '}\n';
                cssRules += cssRule;
                this._styleRegistry.set(className, fullClass);
            });
            this._injectCSS(cssRules);
            this._initialized = true;
        }

        removeStyles() {
            const styleElement = DOMHandler.getElementById(this._styleElementId);
            if (styleElement) DOMHandler.removeElement(styleElement);
            this._styleRegistry.clear();
            this._initialized = false;
        }

        updateStyles(newStyles, newClassnames, newStyleValues) {
            this.styles = newStyles;
            this.classnames = newClassnames;
            this.styleValues = newStyleValues;
            this._validateArrays();
            this.removeStyles();
            this.injectStyles();
        }

        _injectCSS(cssRules) {
            this.removeStyles();
            const styleElement = DOMHandler.createElement('style', {
                id: this._styleElementId,
                textContent: cssRules
            });
            DOMHandler.appendChild(document.head, styleElement);
        }
    }

    class Component {
        constructor(styleRegistry, classPrefix, props = {}) {
            if (!styleRegistry || !(styleRegistry instanceof StyleRegistry)) {
                throw new Error('Component requires a StyleRegistry instance');
            }
            this.styleRegistry = styleRegistry;
            this.classPrefix = classPrefix;
            this.props = props;
            this.state = {};
        }

        cls(className) {
            return this.styleRegistry.cls(this.classPrefix, className);
        }

        render() {
            throw new Error('Component subclass must implement render() method');
        }

        setState(newState, callback) {
            this.state = { ...this.state, ...newState };
            if (callback) callback();
        }
    }

    class ImportRegistry {
        constructor() {
            this.imports = new Map();
            this.loadedModules = new Map();
            this.dependencies = new Map();
        }

        static getInstance() {
            if (!ImportRegistry.instance) ImportRegistry.instance = new ImportRegistry();
            return ImportRegistry.instance;
        }

        register(config) {
            this.imports.set(config.alias, config);
            if (config.dependencies) this.dependencies.set(config.alias, config.dependencies);
        }

        async resolve(alias) {
            if (this.loadedModules.has(alias)) return this.loadedModules.get(alias);
            const config = this.imports.get(alias);
            if (!config) throw new Error(`Module '${alias}' not registered`);
            if (config.dependencies) {
                for (const dep of config.dependencies) await this.resolve(dep);
            }
            const module = await this._loadModule(config);
            this.loadedModules.set(alias, module);
            return module;
        }

        async _loadModule(config) {
            if (config.lazy) return () => import(config.path);
            return await import(config.path);
        }

        getImportMap() {
            return this.imports;
        }

        generateImportFile() {
            let imports = '';
            for (const [alias, config] of this.imports) {
                imports += `import ${alias} from '${config.path}';\n`;
            }
            return imports;
        }
    }

    class ComponentFactory {
        constructor() {
            this.components = new Map();
            this.variants = new Map();
        }

        static getInstance() {
            if (!ComponentFactory.instance) ComponentFactory.instance = new ComponentFactory();
            return ComponentFactory.instance;
        }

        register(type, component) {
            this.components.set(type, component);
        }

        registerVariant(type, variant, component) {
            if (!this.variants.has(type)) this.variants.set(type, new Map());
            this.variants.get(type).set(variant, component);
        }

        create(config) {
            const { type, variant, props = {} } = config;
            if (variant && this.variants.has(type) && this.variants.get(type).has(variant)) {
                const Component = this.variants.get(type).get(variant);
                return new Component(props);
            }
            if (this.components.has(type)) {
                const Component = this.components.get(type);
                return new Component(props);
            }
            throw new Error(`Component type '${type}' not registered`);
        }

        getAvailableTypes() {
            return Array.from(this.components.keys());
        }
    }

    class ModuleLoader {
        constructor() {
            this.loadedModules = new Map();
            this.preloadQueue = [];
        }

        static getInstance() {
            if (!ModuleLoader.instance) ModuleLoader.instance = new ModuleLoader();
            return ModuleLoader.instance;
        }

        async loadModule(path) {
            if (this.loadedModules.has(path)) return this.loadedModules.get(path);
            try {
                const module = await import(path);
                this.loadedModules.set(path, module);
                return module;
            } catch (error) {
                console.error(`Failed to load module: ${path}`, error);
                throw error;
            }
        }

        async preloadModules(paths) {
            const promises = paths.map(path => this.loadModule(path));
            await Promise.all(promises);
        }

        createLazyComponent(path) {
            return () => this.loadModule(path);
        }
    }

    class ProviderWrapper {
        constructor() {
            this.wrappers = [];
            this.middleware = [];
        }

        static getInstance() {
            if (!ProviderWrapper.instance) ProviderWrapper.instance = new ProviderWrapper();
            return ProviderWrapper.instance;
        }

        wrap(children, config) {
            let wrappedChildren = children;
            config.providers.forEach(provider => {
                const ProviderComponent = provider.component;
                const element = DOMHandler.createElement('div', {
                    className: 'provider-wrapper'
                });
                
                if (provider.props) {
                    DOMHandler.setDataAttributes(element, provider.props);
                }
                
                DOMHandler.appendChild(element, wrappedChildren);
                wrappedChildren = element;
            });
            return wrappedChildren;
        }

        compose(...wrappers) {
            return (children) => {
                return wrappers.reduceRight((acc, Wrapper) => {
                    const element = DOMHandler.createElement('div', {
                        className: 'composed-wrapper'
                    });
                    DOMHandler.appendChild(element, acc);
                    return element;
                }, children);
            };
        }
    }

    // Enhanced DOMHandler class with comprehensive DOM utilities
    class DOMHandler {
        // Core element creation
        static createElement(tag, attributes = {}) {
            const element = document.createElement(tag);
            this.setAttributes(element, attributes);
            return element;
        }

        // Create text node
        static createTextNode(text) {
            return document.createTextNode(text);
        }

        // Create document fragment
        static createFragment() {
            return document.createDocumentFragment();
        }

        // Enhanced appendChildren - supports multiple children
        static appendChildren(parent, ...children) {
            const fragment = this.createFragment();
            
            children.forEach(child => {
                if (child !== null && child !== undefined) {
                    if (Array.isArray(child)) {
                        // Handle nested arrays
                        this.appendChildren(fragment, ...child);
                    } else if (typeof child === 'string' || typeof child === 'number') {
                        fragment.appendChild(this.createTextNode(String(child)));
                    } else if (child instanceof Node) {
                        fragment.appendChild(child);
                    } else if (typeof child === 'object' && child.tag) {
                        // Handle config objects
                        fragment.appendChild(this.createElementFromConfig(child));
                    }
                }
            });
            
            parent.appendChild(fragment);
            return parent;
        }

        // Single child append
        static appendChild(parent, child) {
            if (child !== null && child !== undefined) {
                if (typeof child === 'string' || typeof child === 'number') {
                    parent.appendChild(this.createTextNode(String(child)));
                } else if (child instanceof Node) {
                    parent.appendChild(child);
                } else if (typeof child === 'object' && child.tag) {
                    parent.appendChild(this.createElementFromConfig(child));
                }
            }
            return parent;
        }

        // Prepend children
        static prependChildren(parent, ...children) {
            const fragment = this.createFragment();
            this.appendChildren(fragment, ...children);
            parent.insertBefore(fragment, parent.firstChild);
            return parent;
        }

        // Insert children at specific position
        static insertChildrenAt(parent, index, ...children) {
            const fragment = this.createFragment();
            this.appendChildren(fragment, ...children);
            const referenceNode = parent.children[index] || null;
            parent.insertBefore(fragment, referenceNode);
            return parent;
        }

        // Set multiple attributes
        static setAttributes(element, attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    this.setStyles(element, value);
                } else if (key === 'events' && typeof value === 'object') {
                    this.setEvents(element, value);
                } else if (key === 'data' && typeof value === 'object') {
                    this.setDataAttributes(element, value);
                } else {
                    element.setAttribute(key, value);
                }
            });
            return element;
        }

        // Set data attributes
        static setDataAttributes(element, data) {
            Object.entries(data).forEach(([key, value]) => {
                element.setAttribute(`data-${key}`, value);
            });
            return element;
        }

        // Set styles
        static setStyles(element, styles) {
            Object.entries(styles).forEach(([property, value]) => {
                element.style[property] = value;
            });
            return element;
        }

        // Set event listeners
        static setEvents(element, events) {
            Object.entries(events).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
            return element;
        }

        // Remove element
        static removeElement(element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            return element;
        }

        // Remove all children
        static removeAllChildren(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            return parent;
        }

        // Replace element
        static replaceElement(oldElement, newElement) {
            if (oldElement && oldElement.parentNode) {
                oldElement.parentNode.replaceChild(newElement, oldElement);
            }
            return newElement;
        }

        // Clone element
        static cloneElement(element, deep = true) {
            return element.cloneNode(deep);
        }

        // Query selectors
        static querySelector(selector, parent = document) {
            return parent.querySelector(selector);
        }

        static querySelectorAll(selector, parent = document) {
            return parent.querySelectorAll(selector);
        }

        static getElementById(id) {
            return document.getElementById(id);
        }

        static getElementsByClassName(className, parent = document) {
            return parent.getElementsByClassName(className);
        }

        static getElementsByTagName(tagName, parent = document) {
            return parent.getElementsByTagName(tagName);
        }

        // Class manipulation
        static addClass(element, ...classNames) {
            element.classList.add(...classNames);
            return element;
        }

        static removeClass(element, ...classNames) {
            element.classList.remove(...classNames);
            return element;
        }

        static toggleClass(element, className, force) {
            return element.classList.toggle(className, force);
        }

        static hasClass(element, className) {
            return element.classList.contains(className);
        }

        // Create element from config (enhanced)
        static createElementFromConfig(config) {
            if (typeof config === 'string') {
                return this.createTextNode(config);
            }

            const { tag, className, attributes = {}, children = [], events = {}, style = {} } = config;
            const element = this.createElement(tag);

            if (className) element.className = className;
            if (Object.keys(style).length > 0) this.setStyles(element, style);
            if (Object.keys(events).length > 0) this.setEvents(element, events);
            
            this.setAttributes(element, attributes);
            
            if (children.length > 0) {
                this.appendChildren(element, ...children);
            }

            return element;
        }

        // Batch operations
        static batchOperation(callback) {
            const fragment = this.createFragment();
            callback(fragment);
            return fragment;
        }

        // Check if element exists in DOM
        static isInDOM(element) {
            return document.contains(element);
        }

        // Get element dimensions
        static getDimensions(element) {
            const rect = element.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            };
        }

        // Scroll utilities
        static scrollIntoView(element, options = { behavior: 'smooth' }) {
            element.scrollIntoView(options);
        }

        static scrollToTop(element, smooth = true) {
            element.scrollTo({
                top: 0,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    }

    // Updated DOMFactory to use DOMHandler
    class DOMFactory {
        static createElement(config) {
            return DOMHandler.createElementFromConfig(config);
        }

        static appendChildren(parent, children) {
            return DOMHandler.appendChildren(parent, ...children);
        }
    }

    // Expose the MyHTML5 library to the global object
    const MyHTML5 = {
        StyleRegistry,
        Component,
        ClassRegistry,
        ImportRegistry,
        ComponentFactory,
        ModuleLoader,
        ProviderWrapper,
        DOMFactory,
        DOMHandler  // Added DOMHandler to exports
    };

    // Export the library for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MyHTML5;
    } else if (typeof define === 'function' && define.amd) {
        define('MyHTML5', [], function() { return MyHTML5; });
    } else {
        global.MyHTML5 = MyHTML5;
    }

})(typeof window !== 'undefined' ? window : this);
