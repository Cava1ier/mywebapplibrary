MyHTML5 Library README for AI Agents
Introduction
MyHTML5 is a modular JavaScript library designed for efficient CSS style management and DOM manipulation. It provides classes like StyleRegistry for dynamic styling (including themes, animations, and transitions) and DOMHandler for comprehensive DOM operations (including enhanced form handling). This README is specifically tailored for AI agents, such as language models or automated scripts, to guide optimal usage in generating, modifying, or interacting with web content programmatically.
The library is self-contained in a single file and can be included via a <script> tag or imported as a module. It emphasizes performance, modularity, and error handling to suit AI-driven workflows where code is generated dynamically.
Key Principles for AI Agents

Deterministic and Predictable Usage: Always use explicit methods to avoid side effects. The library throws descriptive errors for invalid inputs, so wrap calls in try-catch blocks in generated code.
Modularity for AI Generation: Break down tasks into small, composable operations (e.g., create styles first, then elements). This aligns with AI's step-by-step reasoning.
Performance Awareness: Use getPerformanceStats to monitor resource usage, especially in long-running scripts or when generating large UIs.
Dynamic Adaptation: Leverage observers and export/import features to persist or adapt styles/themes across sessions or AI iterations.
No External Dependencies: The library is vanilla JS, making it ideal for sandboxed environments or AI-generated snippets without additional setups.
Error-Resilient Code Generation: When generating code, include checks for DOM readiness (e.g., document.readyState === 'complete').

Best Ways to Use the Library
1. Initialization

Start with StyleRegistry using a unique appPrefix to namespace styles and avoid conflicts in shared environments:
javascriptconst registry = new MyHTML5.StyleRegistry('aiGeneratedApp');

For DOM operations, use DOMHandler statically—no instantiation needed.

2. Style Management with StyleRegistry

Scoped Classes: Use addClassPrefix to define groups of classes. Ideal for AI generating component-specific styles:
javascriptregistry.addClassPrefix('aiButton', ['background-color', 'color'], ['primary', 'secondary'], [['#007bff', '#fff'], ['#dc3545', '#fff']]);
const className = registry.cls('aiButton', 'primary'); // 'aiGeneratedApp-aiButton-primary'

Global Styles and Transitions: Add global rules or transitions for smooth UI effects. Transitions are enhanced for easy addition:
javascriptregistry.addGlobalStyle('body', { fontFamily: 'Arial, sans-serif' });
registry.addTransition('.aiButton', ['background-color', 'color'], '0.5s', 'ease-in-out');

Themes for Dynamic UIs: Perfect for AI adapting to user preferences (e.g., dark mode):
javascriptregistry.addTheme('dark', {
  variables: { bgColor: '#333' },
  styles: { 'body': { background: 'var(--aiGeneratedApp-bgColor)', color: '#fff' } }
});
registry.setTheme('dark');

Animations: Add keyframes for visual feedback:
javascriptregistry.addAnimation('fadeIn', { '0%': { opacity: 0 }, '100%': { opacity: 1 } });

Observers for Reactivity: Register callbacks to monitor changes, useful for AI syncing state:
javascriptconst unsubscribe = registry.addObserver(({ type, action, data }) => {
  console.log(`Style change: ${type} ${action} ${data}`);
});
// Later: unsubscribe();

Persistence: Use exportStyles and importStyles to serialize state for multi-turn AI interactions.

3. DOM Manipulation with DOMHandler

Declarative Creation: Use createElementFromConfig for AI-generated structures—supports nested configs:
javascriptconst element = MyHTML5.DOMHandler.createElementFromConfig({
  tag: 'div',
  className: 'aiContainer',
  style: { display: 'flex' },
  children: [
    { tag: 'button', textContent: 'Click Me', events: { click: () => alert('AI Action') } }
  ]
});
MyHTML5.DOMHandler.appendChild(document.body, element);

Form Handling (Enhanced): Serialize and set form data easily, great for AI processing user inputs:
javascriptconst form = MyHTML5.DOMHandler.createForm({
  id: 'aiForm',
  elements: [
    { tag: 'input', attributes: { type: 'text', name: 'username' } },
    { tag: 'input', attributes: { type: 'password', name: 'password' } }
  ]
});
MyHTML5.DOMHandler.appendChild(document.body, form);
// Later:
MyHTML5.DOMHandler.setFormData(form, { username: 'aiUser', password: 'secret' });
const data = MyHTML5.DOMHandler.getFormData(form); // { username: 'aiUser', password: 'secret' }

Batch Updates: Use batchOperation for efficient DOM changes in AI-generated loops:
javascriptconst fragment = MyHTML5.DOMHandler.batchOperation(frag => {
  for (let i = 0; i < 100; i++) {
    MyHTML5.DOMHandler.appendChild(frag, MyHTML5.DOMHandler.createTextNode(`Item ${i}`));
  }
});
MyHTML5.DOMHandler.appendChild(document.body, fragment);

Querying and Utilities: Chain methods for concise AI code:
javascriptconst elem = MyHTML5.DOMHandler.querySelector('.aiContainer');
MyHTML5.DOMHandler.addClass(elem, 'highlighted');
MyHTML5.DOMHandler.scrollIntoView(elem);


4. Integration in AI Workflows

Code Generation: When outputting JS snippets, include the library via:
html<script src="path/to/myhtml5.js"></script>
Or as ESM: import { StyleRegistry, DOMHandler } from './myhtml5.js';
Multi-Step Reasoning: Use tools sequentially—e.g., define styles, create elements, then apply transitions.
Debugging: Log registry.getPerformanceStats() in generated code to monitor AI-created UIs.
Cleanup: Call registry.clearAll() at the end of sessions to reset styles.
Edge Cases: Handle non-DOM environments (e.g., Node.js) by checking typeof document !== 'undefined'.

Potential Pitfalls and Tips

Avoid Over-Injection: Don't repeatedly call injectStyles—it's automatic.
Memory Management: Unsubscribe observers and clear registries in long-running AI tasks.
Browser Compatibility: Tested on modern browsers; for older, polyfill if needed.
AI-Specific Optimization: When generating code, prioritize declarative configs over imperative loops for readability and error reduction.

For full API details, refer to the source code comments. This library evolves with enhancements like transition support and form utilities to better serve AI agents in web tasks.
