MyHTML5 StyleRegistry - New Functionalities README
🎨 Enhanced StyleRegistry Features
The StyleRegistry has been significantly enhanced with powerful new features while maintaining 100% backward compatibility with existing functionality.

📋 Table of Contents
Global Styles Management
Theme System
CSS Variables Management
Animation System
Responsive Utilities
Style Observers
Import/Export System
Performance Monitoring
Pseudo-class Support
🌍 Global Styles Management
Add global CSS rules that apply across your entire application.

Basic Usage
javascript


const styleRegistry = new MyHTML5.StyleRegistry('myapp');

// Add global styles
styleRegistry.addGlobalStyle('body', {
    margin: '0',
    padding: '0',
    fontFamily: 'Arial, sans-serif'
});

styleRegistry.addGlobalStyle('*', {
    boxSizing: 'border-box'
});

// Add responsive global styles
styleRegistry.addGlobalStyle('.container', {
    maxWidth: '1200px',
    margin: '0 auto'
}, '(min-width: 768px)');
Methods
addGlobalStyle(selector, styles, mediaQuery?) - Add global CSS rule
removeGlobalStyle(selector, mediaQuery?) - Remove global CSS rule
🎭 Theme System
Create and manage multiple themes for your application with seamless switching.

Creating Themes
javascript


// Define a light theme
styleRegistry.addTheme('light', {
    variables: {
        'primary-color': '#007bff',
        'background-color': '#ffffff',
        'text-color': '#333333',
        'border-color': '#dee2e6'
    },
    styles: {
        '.app-container': {
            backgroundColor: 'var(--myapp-background-color)',
            color: 'var(--myapp-text-color)'
        }
    },
    mediaQueries: {
        '(max-width: 768px)': {
            '.app-container': {
                padding: '10px'
            }
        }
    }
});

// Define a dark theme
styleRegistry.addTheme('dark', {
    variables: {
        'primary-color': '#0d6efd',
        'background-color': '#1a1a1a',
        'text-color': '#ffffff',
        'border-color': '#404040'
    },
    styles: {
        '.app-container': {
            backgroundColor: 'var(--myapp-background-color)',
            color: 'var(--myapp-text-color)'
        }
    }
});
Using Themes
javascript


// Set active theme
styleRegistry.setTheme('dark');

// Get current theme
const currentTheme = styleRegistry.getCurrentTheme(); // 'dark'

// Get available themes
const themes = styleRegistry.getAvailableThemes(); // ['light', 'dark']
🎛️ CSS Variables Management
Dynamically manage CSS custom properties.

Usage
javascript


// Set CSS variables
styleRegistry.setCSSVariable('primary-color', '#ff6b6b');
styleRegistry.setCSSVariable('font-size', '16px');
styleRegistry.setCSSVariable('spacing', '1rem');

// Get CSS variable value
const primaryColor = styleRegistry.getCSSVariable('primary-color');

// Remove CSS variable
styleRegistry.removeCSSVariable('primary-color');

// Use in CSS (automatically prefixed)
// var(--myapp-primary-color)
🎬 Animation System
Define and manage CSS animations with keyframes.

Creating Animations
javascript


// Define a fade-in animation
const fadeInName = styleRegistry.addAnimation('fadeIn', {
    '0%': {
        opacity: '0',
        transform: 'translateY(20px)'
    },
    '100%': {
        opacity: '1',
        transform: 'translateY(0)'
    }
});

// Define a bounce animation
const bounceName = styleRegistry.addAnimation('bounce', {
    '0%, 20%, 53%, 80%, 100%': {
        transform: 'translate3d(0,0,0)'
    },
    '40%, 43%': {
        transform: 'translate3d(0, -30px, 0)'
    },
    '70%': {
        transform: 'translate3d(0, -15px, 0)'
    },
    '90%': {
        transform: 'translate3d(0, -4px, 0)'
    }
});
Using Animations
javascript


// Get animation name for CSS
const animationName = styleRegistry.getAnimationName('fadeIn');

// Use in element styles
element.style.animation = `${animationName} 0.3s ease-in-out`;
📱 Responsive Utilities
Add responsive styles to existing class registries.

Usage
javascript


// First, create a class registry
styleRegistry.addClassPrefix('btn', 
    ['padding', 'font-size', 'border-radius'],
    ['primary', 'secondary'],
    [
        ['12px 24px', '16px', '4px'],
        ['8px 16px', '14px', '4px']
    ]
);

// Add responsive styles
styleRegistry.addResponsiveStyle('btn', 'primary', {
    '(max-width: 768px)': {
        padding: '8px 16px',
        fontSize: '14px'
    },
    '(min-width: 1200px)': {
        padding: '16px 32px',
        fontSize: '18px'
    }
});
ClassRegistry Responsive Methods
javascript


const btnRegistry = styleRegistry.registries.get('btn');

// Add responsive styles directly to registry
btnRegistry.addResponsiveStyle('primary', {
    '(max-width: 480px)': {
        width: '100%',
        display: 'block'
    }
});
👁️ Style Observers
Monitor style registry changes with observer pattern.

Usage
javascript


// Add observer
const unsubscribe = styleRegistry.addObserver((event) => {
    console.log('Style change:', event);
    // event: { type, action, data, registry }
});

// Observer receives events for:
// - classPrefix: added, removed
// - globalStyle: added, removed
// - theme: added, changed
// - cssVariable: set, removed
// - animation: added
// - responsiveStyle: added
// - registry: cleared, imported

// Unsubscribe
unsubscribe();
Example Observer Implementation
javascript


styleRegistry.addObserver(({ type, action, data }) => {
    switch (type) {
        case 'theme':
            if (action === 'changed') {
                console.log(`Theme switched to: ${data}`);
                // Update UI elements, save preference, etc.
            }
            break;
        case 'cssVariable':
            if (action === 'set') {
                console.log(`CSS variable ${data} updated`);
            }
            break;
    }
});
💾 Import/Export System
Save and restore complete style registry state.

Export Styles
javascript


// Export complete registry state
const styleData = styleRegistry.exportStyles();

// Save to localStorage
localStorage.setItem('appStyles', JSON.stringify(styleData));

// Send to server
fetch('/api/save-styles', {
    method: 'POST',
    body: JSON.stringify(styleData)
});
Import Styles
javascript


// Load from localStorage
const savedStyles = JSON.parse(localStorage.getItem('appStyles'));
styleRegistry.importStyles(savedStyles);

// Load from server
fetch('/api/load-styles')
    .then(response => response.json())
    .then(styleData => {
        styleRegistry.importStyles(styleData);
    });
Export Data Structure
javascript


{
    appPrefix: 'myapp',
    registries: {
        'btn': { styles: [...], classnames: [...], styleValues: [...] }
    },
    globalStyles: {
        'body': { selector: 'body', styles: {...}, mediaQuery: null }
    },
    themes: {
        'dark': { variables: {...}, styles: {...}, mediaQueries: {...} }
    },
    cssVariables: {
        'primary-color': '#007bff'
    },
    animations: {
        'fadeIn': { keyframes: {...}, options: {...} }
    },
    currentTheme: 'dark'
}
📊 Performance Monitoring
Monitor registry performance and usage statistics.

Usage
javascript


// Get performance stats
const stats = styleRegistry.getPerformanceStats();

console.log(stats);
// Output:
// {
//     registriesCount: 5,
//     globalStylesCount: 12,
//     themesCount: 3,
//     animationsCount: 8,
//     cssVariablesCount: 15,
//     observersCount: 2,
//     injectedStylesCount: 5
// }
🎯 Pseudo-class Support
Add hover, focus, active, and other pseudo-class styles.

Usage
javascript


const btnRegistry = styleRegistry.registries.get('btn');

// Add hover styles
btnRegistry.addPseudoStyle('primary', 'hover', {
    backgroundColor: '#0056b3',
    transform: 'translateY(-1px)'
});

// Add focus styles
btnRegistry.addPseudoStyle('primary', 'focus', {
    outline: '2px solid #007bff',
    outlineOffset: '2px'
});

// Add active styles
btnRegistry.addPseudoStyle('primary', 'active', {
    transform: 'translateY(0)',
    backgroundColor: '#004085'
});
🔄 Complete Example
Here's a comprehensive example using multiple new features:

javascript


// Initialize registry
const styleRegistry = new MyHTML5.StyleRegistry('myapp');

// Add observer for debugging
styleRegistry.addObserver(console.log);

// Create themes
styleRegistry.addTheme('light', {
    variables: {
        'bg': '#ffffff',
        'text': '#333333',
        'primary': '#007bff'
    }
});

styleRegistry.addTheme('dark', {
    variables: {
        'bg': '#1a1a1a',
        'text': '#ffffff',
        'primary': '#0d6efd'
    }
});

// Add global styles
styleRegistry.addGlobalStyle('body', {
    backgroundColor: 'var(--myapp-bg)',
    color: 'var(--myapp-text)',
    transition: 'all 0.3s ease'
});

// Create animations
styleRegistry.addAnimation('slideIn', {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0)' }
});

// Create button registry
styleRegistry.addClassPrefix('btn', 
    ['padding', 'backgroundColor
