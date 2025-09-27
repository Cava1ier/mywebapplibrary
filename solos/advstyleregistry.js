(function(global) {
    'use strict';

    class StyleRegistry {
        constructor(appPrefix) {
            if (!appPrefix) throw new Error('StyleRegistry requires an app prefix');
            this.appPrefix = appPrefix;
            this.registries = new Map();
            this.injectedStyles = new Set();
            this._styleElement = null;
            this._globalStyles = new Map(); // New: Global styles
            this._themes = new Map(); // New: Theme management
            this._currentTheme = null; // New: Current active theme
            this._mediaQueries = new Map(); // New: Responsive styles
            this._animations = new Map(); // New: Animation definitions
            this._cssVariables = new Map(); // New: CSS custom properties
            this._styleObservers = new Set(); // New: Style change observers
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
            this._notifyObservers('classPrefix', 'added', classPrefix);
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
                this._notifyObservers('classPrefix', 'removed', classPrefix);
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
            this._clearGlobalStyles();
            this._clearThemes();
            this._clearAnimations();
            this._clearCSSVariables();
            this._notifyObservers('registry', 'cleared');
        }

        // NEW: Global styles management
        addGlobalStyle(selector, styles, mediaQuery = null) {
            const key = mediaQuery ? `${selector}@${mediaQuery}` : selector;
            this._globalStyles.set(key, { selector, styles, mediaQuery });
            this._injectGlobalStyles();
            this._notifyObservers('globalStyle', 'added', key);
            return this;
        }

        removeGlobalStyle(selector, mediaQuery = null) {
            const key = mediaQuery ? `${selector}@${mediaQuery}` : selector;
            this._globalStyles.delete(key);
            this._injectGlobalStyles();
            this._notifyObservers('globalStyle', 'removed', key);
            return this;
        }

        _injectGlobalStyles() {
            const globalStyleId = `${this.appPrefix}-global-styles`;
            let styleElement = DOMHandler.getElementById(globalStyleId);
            
            if (styleElement) {
                DOMHandler.removeElement(styleElement);
            }

            if (this._globalStyles.size > 0) {
                let cssRules = '';
                const mediaGroups = new Map();

                for (const [key, { selector, styles, mediaQuery }] of this._globalStyles) {
                    let cssRule = `${selector} {\n`;
                    Object.entries(styles).forEach(([property, value]) => {
                        cssRule += `  ${property}: ${value};\n`;
                    });
                    cssRule += '}\n';

                    if (mediaQuery) {
                        if (!mediaGroups.has(mediaQuery)) {
                            mediaGroups.set(mediaQuery, []);
                        }
                        mediaGroups.get(mediaQuery).push(cssRule);
                    } else {
                        cssRules += cssRule;
                    }
                }

                // Add media query rules
                for (const [mediaQuery, rules] of mediaGroups) {
                    cssRules += `@media ${mediaQuery} {\n${rules.join('')}}\n`;
                }

                styleElement = DOMHandler.createElement('style', {
                    id: globalStyleId,
                    textContent: cssRules
                });
                DOMHandler.appendChild(document.head, styleElement);
            }
        }

        _clearGlobalStyles() {
            const globalStyleId = `${this.appPrefix}-global-styles`;
            const styleElement = DOMHandler.getElementById(globalStyleId);
            if (styleElement) {
                DOMHandler.removeElement(styleElement);
            }
            this._globalStyles.clear();
        }

        // NEW: Theme management
        addTheme(themeName, themeConfig) {
            const { variables = {}, styles = {}, mediaQueries = {} } = themeConfig;
            this._themes.set(themeName, { variables, styles, mediaQueries });
            this._notifyObservers('theme', 'added', themeName);
            return this;
        }

        setTheme(themeName) {
            const theme = this._themes.get(themeName);
            if (!theme) {
                throw new Error(`Theme '${themeName}' not found`);
            }

            this._currentTheme = themeName;
            this._applyTheme(theme);
            this._notifyObservers('theme', 'changed', themeName);
            return this;
        }

        getCurrentTheme() {
            return this._currentTheme;
        }

        getAvailableThemes() {
            return Array.from(this._themes.keys());
        }

        _applyTheme(theme) {
            // Apply CSS variables
            Object.entries(theme.variables).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--${this.appPrefix}-${key}`, value);
            });

            // Apply theme styles
            const themeStyleId = `${this.appPrefix}-theme-styles`;
            let styleElement = DOMHandler.getElementById(themeStyleId);
            
            if (styleElement) {
                DOMHandler.removeElement(styleElement);
            }

            let cssRules = '';
            Object.entries(theme.styles).forEach(([selector, styles]) => {
                cssRules += `${selector} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    cssRules += `  ${property}: ${value};\n`;
                });
                cssRules += '}\n';
            });

            // Apply media queries
            Object.entries(theme.mediaQueries).forEach(([mediaQuery, styles]) => {
                cssRules += `@media ${mediaQuery} {\n`;
                Object.entries(styles).forEach(([selector, selectorStyles]) => {
                    cssRules += `  ${selector} {\n`;
                    Object.entries(selectorStyles).forEach(([property, value]) => {
                        cssRules += `    ${property}: ${value};\n`;
                    });
                    cssRules += '  }\n';
                });
                cssRules += '}\n';
            });

            if (cssRules) {
                styleElement = DOMHandler.createElement('style', {
                    id: themeStyleId,
                    textContent: cssRules
                });
                DOMHandler.appendChild(document.head, styleElement);
            }
        }

        _clearThemes() {
            const themeStyleId = `${this.appPrefix}-theme-styles`;
            const styleElement = DOMHandler.getElementById(themeStyleId);
            if (styleElement) {
                DOMHandler.removeElement(styleElement);
            }
            this._themes.clear();
            this._currentTheme = null;
        }

        // NEW: CSS Variables management
        setCSSVariable(name, value) {
            const fullName = `--${this.appPrefix}-${name}`;
            document.documentElement.style.setProperty(fullName, value);
            this._cssVariables.set(name, value);
            this._notifyObservers('cssVariable', 'set', name);
            return this;
        }

        getCSSVariable(name) {
            return this._cssVariables.get(name);
        }

        removeCSSVariable(name) {
            const fullName = `--${this.appPrefix}-${name}`;
            document.documentElement.style.removeProperty(fullName);
            this._cssVariables.delete(name);
            this._notifyObservers('cssVariable', 'removed', name);
            return this;
        }

        _clearCSSVariables() {
            for (const name of this._cssVariables.keys()) {
                const fullName = `--${this.appPrefix}-${name}`;
                document.documentElement.style.removeProperty(fullName);
            }
            this._cssVariables.clear();
        }

        // NEW: Animation management
        addAnimation(name, keyframes, options = {}) {
            const animationName = `${this.appPrefix}-${name}`;
            this._animations.set(name, { keyframes, options, animationName });
            this._injectAnimation(name, keyframes, options);
            this._notifyObservers('animation', 'added', name);
            return animationName;
        }

        _injectAnimation(name, keyframes, options) {
            const animationStyleId = `${this.appPrefix}-animations`;
            let styleElement = DOMHandler.getElementById(animationStyleId);
            
            if (!styleElement) {
                styleElement = DOMHandler.createElement('style', {
                    id: animationStyleId
                });
                DOMHandler.appendChild(document.head, styleElement);
            }

            const animationName = `${this.appPrefix}-${name}`;
            let cssRule = `@keyframes ${animationName} {\n`;
            
            Object.entries(keyframes).forEach(([percentage, styles]) => {
                cssRule += `  ${percentage} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    cssRule += `    ${property}: ${value};\n`;
                });
                cssRule += '  }\n';
            });
            cssRule += '}\n';

            styleElement.textContent += cssRule;
        }

        getAnimationName(name) {
            const animation = this._animations.get(name);
            return animation ? animation.animationName : null;
        }

        _clearAnimations() {
            const animationStyleId = `${this.appPrefix}-animations`;
            const styleElement = DOMHandler.getElementById(animationStyleId);
            if (styleElement) {
                DOMHandler.removeElement(styleElement);
            }
            this._animations.clear();
        }

        // NEW: Responsive utilities
        addResponsiveStyle(classPrefix, className, breakpoints) {
            const registry = this.registries.get(classPrefix);
            if (!registry) {
                throw new Error(`Class prefix '${classPrefix}' not registered`);
            }
            
            registry.addResponsiveStyle(className, breakpoints);
            this._notifyObservers('responsiveStyle', 'added', `${classPrefix}.${className}`);
            return this;
        }

        // NEW: Style observers
        addObserver(callback) {
            this._styleObservers.add(callback);
            return () => this._styleObservers.delete(callback);
        }

        _notifyObservers(type, action, data) {
            this._styleObservers.forEach(callback => {
                try {
                    callback({ type, action, data, registry: this });
                } catch (error) {
                    console.error('Style observer error:', error);
                }
            });
        }

        // NEW: Utility methods
        exportStyles() {
            const exported = {
                appPrefix: this.appPrefix,
                registries: {},
                globalStyles: Object.fromEntries(this._globalStyles),
                themes: Object.fromEntries(this._themes),
                cssVariables: Object.fromEntries(this._cssVariables),
                animations: Object.fromEntries(this._animations),
                currentTheme: this._currentTheme
            };

            for (const [prefix, registry] of this.registries) {
                exported.registries[prefix] = registry.export();
            }

            return exported;
        }

        importStyles(styleData) {
            const { registries, globalStyles, themes, cssVariables, animations, currentTheme } = styleData;

            // Import registries
            Object.entries(registries).forEach(([prefix, data]) => {
                const registry = new ClassRegistry(this.appPrefix, prefix, data.styles, data.classnames, data.styleValues);
                this.registries.set(prefix, registry);
                registry.injectStyles();
                this.injectedStyles.add(prefix);
            });

            // Import global styles
            Object.entries(globalStyles).forEach(([key, data]) => {
                this._globalStyles.set(key, data);
            });
            this._injectGlobalStyles();

            // Import themes
            Object.entries(themes).forEach(([name, theme]) => {
                this._themes.set(name, theme);
            });

            // Import CSS variables
            Object.entries(cssVariables).forEach(([name, value]) => {
                this.setCSSVariable(name, value);
            });

            // Import animations
            Object.entries(animations).forEach(([name, data]) => {
                this._animations.set(name, data);
                this._injectAnimation(name, data.keyframes, data.options);
            });

            // Set current theme
            if (currentTheme && this._themes.has(currentTheme)) {
                this.setTheme(currentTheme);
            }

            this._notifyObservers('registry', 'imported');
            return this;
        }

        // NEW: Performance monitoring
        getPerformanceStats() {
            return {
                registriesCount: this.registries.size,
                globalStylesCount: this._globalStyles.size,
                themesCount: this._themes.size,
                animationsCount: this._animations.size,
                cssVariablesCount: this._cssVariables.size,
                observersCount: this._styleObservers.size,
                injectedStylesCount: this.injectedStyles.size
            };
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
            this._responsiveStyles = new Map(); // NEW: Responsive styles
            this._pseudoStyles = new Map(); // NEW: Pseudo-class styles
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
            
            // Regular styles
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

            // Responsive styles
            for (const [className, breakpoints] of this._responsiveStyles) {
                const fullClass = `${this.appPrefix}-${this.classPrefix}-${className}`;
                Object.entries(breakpoints).forEach(([breakpoint, styles]) => {
                    cssRules += `@media ${breakpoint} {\n`;
                    cssRules += `.${fullClass} {\n`;
                    Object.entries(styles).forEach(([property, value]) => {
                        cssRules += `${property}: ${value};\n`;
                    });
                    cssRules += '}\n}\n';
                });
            }

            // Pseudo-class styles
            for (const [className, pseudoStyles] of this._pseudoStyles) {
                const fullClass = `${this.appPrefix}-${this.classPrefix}-${className}`;
                Object.entries(pseudoStyles).forEach(([pseudo, styles]) => {
                    cssRules += `.${fullClass}:${pseudo} {\n`;
                    Object.entries(styles).forEach(([property, value]) => {
                        cssRules += `${property}: ${value};\n`;
                    });
                    cssRules += '}\n';
                });
            }

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

        // NEW: Add responsive styles
        addResponsiveStyle(className, breakpoints) {
            this._responsiveStyles.set(className, breakpoints);
            if (this._initialized) {
                this.injectStyles();
            }
            return this;
        }

        // NEW: Add pseudo-class styles
        addPseudoStyle(className, pseudo, styles) {
            if (!this._pseudoStyles.has(className)) {
                this._pseudoStyles.set(className, {});
            }
            this._pseudoStyles.get(className)[pseudo] = styles;
            if (this._initialized) {
                this.injectStyles();
            }
            return this;
        }

        // NEW: Export registry data
        export() {
            return {
                appPrefix: this.appPrefix,
                classPrefix: this.classPrefix,
                styles: this.styles,
                classnames: this.classnames,
                styleValues: this.styleValues,
                responsiveStyles: Object.fromEntries(this._responsiveStyles),
                pseudoStyles: Object.fromEntries(this._pseudoStyles)
            };
        }
    }

    // Rest of the classes remain the same...
    // [Component, ImportRegistry, ComponentFactory, ModuleLoader, ProviderWrapper, DOMHandler, DOMFactory classes]

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
        DOMHandler
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
