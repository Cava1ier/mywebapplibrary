/*TODO:::I want to participate in a storium collaboration with you about eastern culture fantasy cultivist trope with native american North American English words as naming conventions for people but themed ie Running Bull might be better instead Jade Fox or so... that way a broader audience of readers of english language may find the story more relatable but still enjoy the eastern culture
I am trying to design with you and other ai agents an easy way to put in what the storium cards look like
I DO NOT LIKE JSON please just use related tables and a database driver/database/views/tables/columns/rows classes to relate information so
let data='
tblGame
id|name|description
1|SYMPHONY OF THE BROKEN DAO|The very laws of cultivation (the Dao) are fracturing. The cosmic forces you created aren’t just abstract concepts; they are manifestations of this breakdown. Cultivators must navigate a world where reality itself is unstable
tblPlayers
id|name|isInScene|description
1|Sinton|Yes| Paragon who is chaotic or something
2|Qhaway|Yes| The song of the lands and beats of qi call to them.
tblCardTypes
id|type
1|Nature
2|Strength
3|Weakness
4|Subplot
5|Wild
6|Assets
7|Goals
8|Places
9|Chrctrs
10|Obsticles
tblChrctrsCards
id|player_id|cardtype_id|title|description
1|1|1|TODO|TODO
2|1|2|TODO|TODO
3|1|3|TODO|TODO
4|1|1|TODO|TODO
5|1|2|TODO|TODO
6|1|3|TODO|TODO
tblScenes
tblScenesCards
tblObsticlesChallenges
tblPlayerToObsticlesCards
etc etc '
then populate a text area and then a button that uses regex and recursion to fill elements as needed and then a button to take interactive edit/chnages/additions so on .. back to tables... for ai collaboration
after this we can generate easily a narrative .. in the beginning will have a sensory (touch,taste,smell,sight,hear) and an descriptive adject and verb and personification of a person place / thing.. but first the html 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chrctr Manager - Style Registry Framework</title>
<script>

const stylRgstry = new StyleRegistry('charManager');
const componentFactory = ComponentFactory.getInstance();
const importRegistry = ImportRegistry.getInstance();
const moduleLoader = ModuleLoader.getInstance();
const providerWrapper = ProviderWrapper.getInstance();
stylRgstry.addClassPrefix('container', 
['max-width', 'margin', 'padding', 'font-family'], 
['main'], 
[['1200px', '0 auto', '20px', 'Arial, sans-serif']]
);
stylRgstry.addClassPrefix('header', 
['text-align', 'margin-bottom', 'color', 'background', 'padding', 'border-radius'], 
['main'], 
[['center', '30px', '#4a6fa5', '#f8f9fa', '20px', '8px']]
);
stylRgstry.addClassPrefix('layout', 
['display', 'grid-template-columns', 'gap', 'margin-top'], 
['main'], 
[['grid', '1fr 2fr', '20px', '20px']]
);
stylRgstry.addClassPrefix('characterList', 
['background', 'border-radius', 'box-shadow', 'padding', 'height'], 
['main'], 
[['white', '8px', '0 2px 10px rgba(0,0,0,0.1)', '20px', 'fit-content']]
);
stylRgstry.addClassPrefix('characterItem', 
['padding', 'border-left', 'margin-bottom', 'background', 'cursor', 'transition', 'border-radius', 'color'], 
['normal', 'active'], 
[
['12px', '4px solid #4a6fa5', '10px', '#f5f7fa', 'pointer', 'all 0.3s', '4px', '#333'], 
['12px', '4px solid #4a6fa5', '10px', '#4a6fa5', 'pointer', 'all 0.3s', '4px', 'white']
]
);
stylRgstry.addClassPrefix('characterItemHover', 
['background'], 
['normal'], 
[['#e9ecef']]
);
stylRgstry.addClassPrefix('editor', 
['background', 'border-radius', 'box-shadow', 'padding'], 
['main'], 
[['white', '8px', '0 2px 10px rgba(0,0,0,0.1)', '20px']]
);
stylRgstry.addClassPrefix('input', 
['width', 'padding', 'margin-bottom', 'border', 'border-radius', 'font-size', 'box-sizing'], 
['text', 'textarea', 'select'], 
[
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box'], 
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box'], 
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box']
]
);
stylRgstry.addClassPrefix('button', 
['padding', 'background', 'color', 'border', 'border-radius', 'cursor', 'margin-right', 'font-size', 'transition'], 
['primary', 'secondary', 'danger'], 
[
['12px 24px', '#4a6fa5', 'white', 'none', '4px', 'pointer', '10px', '14px', 'all 0.2s'], 
['10px 20px', '#6c757d', 'white', 'none', '4px', 'pointer', '10px', '12px', 'all 0.2s'], 
['10px 20px', '#dc3545', 'white', 'none', '4px', 'pointer', '10px', '12px', 'all 0.2s']
]
);
stylRgstry.addClassPrefix('buttonHover', 
['background'], 
['primary', 'secondary', 'danger'], 
[
['#3d5a91'], 
['#5a6268'], 
['#c82333']
]
);
stylRgstry.addClassPrefix('card', 
['background', 'border', 'border-radius', 'padding', 'margin-bottom', 'position'], 
['item', 'editing'], 
[
['#f8f9fa', '1px solid #dee2e6', '4px', '15px', '10px', 'relative'], 
['#fff3cd', '1px solid #ffeaa7', '4px', '15px', '10px', 'relative']
]
);
stylRgstry.addClassPrefix('cardHeader', 
['display', 'justify-content', 'align-items', 'margin-bottom'], 
['main'], 
[['flex', 'space-between', 'center', '10px']]
);
stylRgstry.addClassPrefix('cardActions', 
['display', 'gap'], 
['main'], 
[['flex', '8px']]
);
stylRgstry.addClassPrefix('form', 
['display', 'flex-direction', 'gap'], 
['main'], 
[['flex', 'column', '15px']]
);
stylRgstry.addClassPrefix('formRow', 
['display', 'gap', 'align-items'], 
['main'], 
[['flex', '10px', 'flex-end']]
);
class DOMFactory {
static createElement(config) {
if (typeof config === 'string') {
return document.createTextNode(config);
}
const { tag, className, attributes = {}, children = [], events = {} } = config;
const element = document.createElement(tag);
if (className) element.className = className;
Object.entries(attributes).forEach(([key, value]) => {
if (key === 'textContent') element.textContent = value;
else if (key === 'innerHTML') element.innerHTML = value;
else element.setAttribute(key, value);
});
Object.entries(events).forEach(([event, handler]) => {
element.addEventListener(event, handler);
});
this.appendChildren(element, children);
return element;
}
static appendChildren(parent, children) {
children.forEach(child => {
if (child) {
const element = typeof child === 'object' && child.tag ? 
this.createElement(child) : child;
parent.appendChild(element);
}
});
}
}
class ChrctrMngr {
constructor() {
this.characters = [
{ 
id: 1, 
name: "Rin", 
description: "A determined cultivator who refuses to give up", 
cards: [
{ id: 1, type: "Strength", title: "Unbreakable Spirit", description: "Despite ridicule, continues to train every day" },
{ id: 2, type: "Weakness", title: "Town Laughingstock", description: "Mocked by everyone for clumsy cultivation attempts" }
]
},
{ 
id: 2, 
name: "Qhaway", 
description: "Rin's loyal friend and supporter", 
cards: [
{ id: 3, type: "Strength", title: "Loyal Friend", description: "Only one who supports and comforts Rin" },
{ id: 4, type: "Strength", title: "Quiet Wisdom", description: "Sees potential where others see failure" }
]
}
];
this.currentChrctrId = 1;
this.editingCardId = null;
this.nextId = 5;
}
getCurrentChrctr() { 
return this.characters.find(c => c.id === this.currentChrctrId); 
}
addChrctr() {
const newChrctr = { 
id: this.nextId++, 
name: "New Chrctr", 
description: "Chrctr description", 
cards: [] 
};
this.characters.push(newChrctr);
this.currentChrctrId = newChrctr.id;
this.render();
}
updateChrctr(id, updates) {
const character = this.characters.find(c => c.id === id);
if (character) Object.assign(character, updates);
this.render();
}
deleteChrctr(id) {
this.characters = this.characters.filter(c => c.id !== id);
if (this.currentChrctrId === id) this.currentChrctrId = this.characters[0]?.id || null;
this.render();
}
addCard(characterId, card) {
const character = this.characters.find(c => c.id === characterId);
if (character) {
card.id = this.nextId++;
character.cards.push(card);
this.render();
}
}
updateCard(characterId, cardId, updates) {
const character = this.characters.find(c => c.id === characterId);
if (character) {
const card = character.cards.find(c => c.id === cardId);
if (card) Object.assign(card, updates);
this.render();
}
}
deleteCard(characterId, cardId) {
const character = this.characters.find(c => c.id === characterId);
if (character) character.cards = character.cards.filter(c => c.id !== cardId);
this.render();
}
renderChrctrList() {
const characterItems = this.characters.map(character => ({
tag: 'div',
className: stylRgstry.cls('characterItem', character.id === this.currentChrctrId ? 'active' : 'normal'),
events: {
click: () => { 
this.currentChrctrId = character.id; 
this.render(); 
},
mouseenter: (e) => {
if (character.id !== this.currentChrctrId) {
e.target.style.background = '#e9ecef';
}
},
mouseleave: (e) => {
if (character.id !== this.currentChrctrId) {
e.target.style.background = '#f5f7fa';
}
}
},
children: [
{ tag: 'h3', attributes: { textContent: character.name } },
{ tag: 'p', attributes: { textContent: character.description } }
]
}));
return {
tag: 'div',
className: stylRgstry.cls('characterList', 'main'),
children: [
{ tag: 'h2', attributes: { textContent: 'Chrctrs' } },
...characterItems,
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Add New Chrctr' },
events: { 
click: () => this.addChrctr(),
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
}
]
};
}
renderChrctrEditor() {
const character = this.getCurrentChrctr();
if (!character) {
return {
tag: 'div',
className: stylRgstry.cls('editor', 'main'),
attributes: { textContent: 'No character selected' }
};
}
const nameInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
value: character.name,
placeholder: 'Chrctr Name'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
value: character.description,
placeholder: 'Chrctr Description',
rows: '3'
}
});
return {
tag: 'div',
className: stylRgstry.cls('editor', 'main'),
children: [
{ tag: 'h2', attributes: { textContent: 'Edit Chrctr' } },
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
nameInput,
descTextarea,
{
tag: 'div',
className: stylRgstry.cls('formRow', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Save Changes' },
events: {
click: () => this.updateChrctr(character.id, { 
name: nameInput.value, 
description: descTextarea.value 
}),
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'danger'),
attributes: { textContent: 'Delete Chrctr' },
events: {
click: () => { 
if (confirm('Delete this character?')) this.deleteChrctr(character.id); 
},
mouseenter: (e) => e.target.style.background = '#c82333',
mouseleave: (e) => e.target.style.background = '#dc3545'
}
}
]
}
]
},
{ tag: 'hr' },
this.renderCardManager(character)
]
};
}
renderCardManager(character) {
const cardElements = character.cards.map(card => {
const isEditing = this.editingCardId === card.id;
if (isEditing) {
return this.renderCardEditForm(character.id, card);
} else {
return {
tag: 'div',
className: stylRgstry.cls('card', 'item'),
children: [
{
tag: 'div',
className: stylRgstry.cls('cardHeader', 'main'),
children: [
{
tag: 'div',
children: [
{ tag: 'strong', attributes: { textContent: card.type + ': ' } },
{ tag: 'span', attributes: { textContent: card.title } }
]
},
{
tag: 'div',
className: stylRgstry.cls('cardActions', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'secondary'),
attributes: { textContent: 'Edit' },
events: {
click: () => { 
this.editingCardId = card.id; 
this.render(); 
},
mouseenter: (e) => e.target.style.background = '#5a6268',
mouseleave: (e) => e.target.style.background = '#6c757d'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'danger'),
attributes: { textContent: 'Remove' },
events: { 
click: () => this.deleteCard(character.id, card.id),
mouseenter: (e) => e.target.style.background = '#c82333',
mouseleave: (e) => e.target.style.background = '#dc3545'
}
}
]
}
]
},
{ tag: 'p', attributes: { textContent: card.description } }
]
};
}
});
return {
tag: 'div',
children: [
{ tag: 'h3', attributes: { textContent: 'Attached Cards' } },
...cardElements,
this.renderAddCardForm(character.id)
]
};
}
renderCardEditForm(characterId, card) {
const typeSelect = DOMFactory.createElement({
tag: 'select',
className: stylRgstry.cls('input', 'select'),
children: ['Strength', 'Weakness', 'Subplot', 'Asset'].map(type => ({
tag: 'option',
attributes: { 
value: type, 
textContent: type,
selected: type === card.type
}
}))
});
const titleInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
value: card.title,
placeholder: 'Card Title'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
value: card.description,
placeholder: 'Card Description',
rows: '2'
}
});
return {
tag: 'div',
className: stylRgstry.cls('card', 'editing'),
children: [
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
typeSelect,
titleInput,
descTextarea,
{
tag: 'div',
className: stylRgstry.cls('formRow', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Save Card' },
events: {
click: () => {
this.updateCard(characterId, card.id, {
type: typeSelect.value,
title: titleInput.value,
description: descTextarea.value
});
this.editingCardId = null;
},
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'secondary'),
attributes: { textContent: 'Cancel' },
events: {
click: () => { 
this.editingCardId = null; 
this.render(); 
},
mouseenter: (e) => e.target.style.background = '#5a6268',
mouseleave: (e) => e.target.style.background = '#6c757d'
}
}
]
}
]
}
]
};
}
renderAddCardForm(characterId) {
const typeSelect = DOMFactory.createElement({
tag: 'select',
className: stylRgstry.cls('input', 'select'),
children: ['Strength', 'Weakness', 'Subplot', 'Asset'].map(type => ({
tag: 'option',
attributes: { value: type, textContent: type }
}))
});
const titleInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
placeholder: 'Card Title'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
placeholder: 'Card Description',
rows: '2'
}
});
return {
tag: 'div',
children: [
{ tag: 'h4', attributes: { textContent: 'Add New Card' } },
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
typeSelect,
titleInput,
descTextarea,
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Add Card' },
events: {
click: () => {
if (titleInput.value.trim()) {
this.addCard(characterId, {
type: typeSelect.value,
title: titleInput.value,
description: descTextarea.value
});
titleInput.value = '';
descTextarea.value = '';
}
},
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
}
]
}
]
};
}
render() {
const app = document.getElementById('app');
app.innerHTML = '';
const mainStructure = {
tag: 'div',
className: stylRgstry.cls('container', 'main'),
children: [
{
tag: 'header',
className: stylRgstry.cls('header', 'main'),
children: [
{ tag: 'h1', attributes: { textContent: 'Chrctr Manager' } },
{ tag: 'p', attributes: { textContent: 'Advanced Framework - Storium-Style Chrctr & Card Management' } }
]
},
{
tag: 'div',
className: stylRgstry.cls('layout', 'main'),
children: [
this.renderChrctrList(),
this.renderChrctrEditor()
]
}
]
};
const mainElement = DOMFactory.createElement(mainStructure);
app.appendChild(mainElement);
}
}
importRegistry.register({ 
alias: 'ChrctrMngr', 
path: './ChrctrMngr.js', 
type: 'component', 
dependencies: ['StyleRegistry', 'DOMFactory'] 
});
importRegistry.register({ 
alias: 'DOMFactory', 
path: './DOMFactory.js', 
type: 'utility', 
dependencies: [] 
});
componentFactory.register('character-manager', ChrctrMngr);
componentFactory.register('dom-factory', DOMFactory);
const chrctrMngr = new ChrctrMngr();
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => chrctrMngr.render());
} else {
chrctrMngr.render();
}
</script>
</body>
</html>I want to participate in a storium collaboration with you about eastern culture fantasy cultivist trope with native american North American English words as naming conventions for people but themed ie Running Bull might be better instead Jade Fox or so... that way a broader audience of readers of english language may find the story more relatable but still enjoy the eastern culture
I am trying to design with you and other ai agents an easy way to put in what the storium cards look like
I DO NOT LIKE JSON please just use related tables and a database driver/database/views/tables/columns/rows classes to relate information so
let data='
tblGame
id|name|description
1|SYMPHONY OF THE BROKEN DAO|The very laws of cultivation (the Dao) are fracturing. The cosmic forces you created aren’t just abstract concepts; they are manifestations of this breakdown. Cultivators must navigate a world where reality itself is unstable
tblPlayers
id|name|isInScene|description
1|Sinton|Yes| Paragon who is chaotic or something
2|Qhaway|Yes| The song of the lands and beats of qi call to them.
tblCardTypes
id|type
1|Nature
2|Strength
3|Weakness
4|Subplot
5|Wild
6|Assets
7|Goals
8|Places
9|Chrctrs
10|Obsticles
tblChrctrsCards
id|player_id|cardtype_id|title|description
1|1|1|TODO|TODO
2|1|2|TODO|TODO
3|1|3|TODO|TODO
4|1|1|TODO|TODO
5|1|2|TODO|TODO
6|1|3|TODO|TODO
tblScenes
tblScenesCards
tblObsticlesChallenges
tblPlayerToObsticlesCards
etc etc '
then populate a text area and then a button that uses regex and recursion to fill elements as needed and then a button to take interactive edit/chnages/additions so on .. back to tables... for ai collaboration
after this we can generate easily a narrative .. in the beginning will have a sensory (touch,taste,smell,sight,hear) and an descriptive adject and verb and personification of a person place / thing.. but first the html 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chrctr Manager - Style Registry Framework</title>
<script>
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
if (this.registries.has(classPrefix)) console.warn(`Class prefix '${classPrefix}' already registered. Overwriting.`);
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
getRegisteredPrefixes() { return Array.from(this.registries.keys()); }
clearAll() {
for (const [classPrefix, registry] of this.registries) registry.removeStyles();
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
this._stylRgstry = new Map();
this._styleElementId = `styles-${appPrefix}-${classPrefix}`;
this._initialized = false;
this._validateArrays();
}
_validateArrays() {
if (this.classnames.length !== this.styleValues.length) throw new Error(`Style Registry Error: classnames (${this.classnames.length}) and styleValues (${this.styleValues.length}) arrays must have same length`);
this.styleValues.forEach((values, index) => {
if (values.length !== this.styles.length) throw new Error(`Style Registry Error: styleValues[${index}] length (${values.length}) must match styles length (${this.styles.length})`);
});
}
cls(className) {
if (!this._initialized) this.injectStyles();
const fullClass = `${this.appPrefix}-${this.classPrefix}-${className}`;
return this._stylRgstry.get(className) || fullClass;
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
this._stylRgstry.set(className, fullClass);
});
this._injectCSS(cssRules);
this._initialized = true;
}
removeStyles() {
const styleElement = document.getElementById(this._styleElementId);
if (styleElement) styleElement.remove();
this._stylRgstry.clear();
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
const styleElement = document.createElement('style');
styleElement.id = this._styleElementId;
styleElement.textContent = cssRules;
document.head.appendChild(styleElement);
}
}
class Component {
constructor(stylRgstry, classPrefix, props = {}) {
if (!stylRgstry || !(stylRgstry instanceof StyleRegistry)) throw new Error('Component requires a StyleRegistry instance');
this.stylRgstry = stylRgstry;
this.classPrefix = classPrefix;
this.props = props;
this.state = {};
}
cls(className) { return this.stylRgstry.cls(this.classPrefix, className); }
render() { throw new Error('Component subclass must implement render() method'); }
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
getImportMap() { return this.imports; }
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
getAvailableTypes() { return Array.from(this.components.keys()); }
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
const element = document.createElement('div');
element.className = 'provider-wrapper';
if (provider.props) {
Object.keys(provider.props).forEach(key => {
element.setAttribute(`data-${key}`, provider.props[key]);
});
}
element.appendChild(wrappedChildren);
wrappedChildren = element;
});
return wrappedChildren;
}
compose(...wrappers) {
return (children) => {
return wrappers.reduceRight((acc, Wrapper) => {
const element = document.createElement('div');
element.className = 'composed-wrapper';
element.appendChild(acc);
return element;
}, children);
};
}
}
const AdvancedFramework = {
StyleRegistry,
Component,
ClassRegistry,
ImportRegistry,
ComponentFactory,
ModuleLoader,
ProviderWrapper
};
if (typeof module !== 'undefined' && module.exports) {
module.exports = AdvancedFramework;
} else if (typeof define === 'function' && define.amd) {
define('AdvancedFramework', [], function() { return AdvancedFramework; });
} else {
global.AdvancedFramework = AdvancedFramework;
}
})(typeof window !== 'undefined' ? window : this);
</script>
</head>
<body>
<div id="app"></div>
<script>
const { StyleRegistry, ComponentFactory, ImportRegistry, ModuleLoader, ProviderWrapper } = AdvancedFramework;
const stylRgstry = new StyleRegistry('charManager');
const componentFactory = ComponentFactory.getInstance();
const importRegistry = ImportRegistry.getInstance();
const moduleLoader = ModuleLoader.getInstance();
const providerWrapper = ProviderWrapper.getInstance();
stylRgstry.addClassPrefix('container', 
['max-width', 'margin', 'padding', 'font-family'], 
['main'], 
[['1200px', '0 auto', '20px', 'Arial, sans-serif']]
);
stylRgstry.addClassPrefix('header', 
['text-align', 'margin-bottom', 'color', 'background', 'padding', 'border-radius'], 
['main'], 
[['center', '30px', '#4a6fa5', '#f8f9fa', '20px', '8px']]
);
stylRgstry.addClassPrefix('layout', 
['display', 'grid-template-columns', 'gap', 'margin-top'], 
['main'], 
[['grid', '1fr 2fr', '20px', '20px']]
);
stylRgstry.addClassPrefix('characterList', 
['background', 'border-radius', 'box-shadow', 'padding', 'height'], 
['main'], 
[['white', '8px', '0 2px 10px rgba(0,0,0,0.1)', '20px', 'fit-content']]
);
stylRgstry.addClassPrefix('characterItem', 
['padding', 'border-left', 'margin-bottom', 'background', 'cursor', 'transition', 'border-radius', 'color'], 
['normal', 'active'], 
[
['12px', '4px solid #4a6fa5', '10px', '#f5f7fa', 'pointer', 'all 0.3s', '4px', '#333'], 
['12px', '4px solid #4a6fa5', '10px', '#4a6fa5', 'pointer', 'all 0.3s', '4px', 'white']
]
);
stylRgstry.addClassPrefix('characterItemHover', 
['background'], 
['normal'], 
[['#e9ecef']]
);
stylRgstry.addClassPrefix('editor', 
['background', 'border-radius', 'box-shadow', 'padding'], 
['main'], 
[['white', '8px', '0 2px 10px rgba(0,0,0,0.1)', '20px']]
);
stylRgstry.addClassPrefix('input', 
['width', 'padding', 'margin-bottom', 'border', 'border-radius', 'font-size', 'box-sizing'], 
['text', 'textarea', 'select'], 
[
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box'], 
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box'], 
['100%', '12px', '15px', '1px solid #ddd', '4px', '14px', 'border-box']
]
);
stylRgstry.addClassPrefix('button', 
['padding', 'background', 'color', 'border', 'border-radius', 'cursor', 'margin-right', 'font-size', 'transition'], 
['primary', 'secondary', 'danger'], 
[
['12px 24px', '#4a6fa5', 'white', 'none', '4px', 'pointer', '10px', '14px', 'all 0.2s'], 
['10px 20px', '#6c757d', 'white', 'none', '4px', 'pointer', '10px', '12px', 'all 0.2s'], 
['10px 20px', '#dc3545', 'white', 'none', '4px', 'pointer', '10px', '12px', 'all 0.2s']
]
);
stylRgstry.addClassPrefix('buttonHover', 
['background'], 
['primary', 'secondary', 'danger'], 
[
['#3d5a91'], 
['#5a6268'], 
['#c82333']
]
);
stylRgstry.addClassPrefix('card', 
['background', 'border', 'border-radius', 'padding', 'margin-bottom', 'position'], 
['item', 'editing'], 
[
['#f8f9fa', '1px solid #dee2e6', '4px', '15px', '10px', 'relative'], 
['#fff3cd', '1px solid #ffeaa7', '4px', '15px', '10px', 'relative']
]
);
stylRgstry.addClassPrefix('cardHeader', 
['display', 'justify-content', 'align-items', 'margin-bottom'], 
['main'], 
[['flex', 'space-between', 'center', '10px']]
);
stylRgstry.addClassPrefix('cardActions', 
['display', 'gap'], 
['main'], 
[['flex', '8px']]
);
stylRgstry.addClassPrefix('form', 
['display', 'flex-direction', 'gap'], 
['main'], 
[['flex', 'column', '15px']]
);
stylRgstry.addClassPrefix('formRow', 
['display', 'gap', 'align-items'], 
['main'], 
[['flex', '10px', 'flex-end']]
);
class DOMFactory {
static createElement(config) {
if (typeof config === 'string') {
return document.createTextNode(config);
}
const { tag, className, attributes = {}, children = [], events = {} } = config;
const element = document.createElement(tag);
if (className) element.className = className;
Object.entries(attributes).forEach(([key, value]) => {
if (key === 'textContent') element.textContent = value;
else if (key === 'innerHTML') element.innerHTML = value;
else element.setAttribute(key, value);
});
Object.entries(events).forEach(([event, handler]) => {
element.addEventListener(event, handler);
});
this.appendChildren(element, children);
return element;
}
static appendChildren(parent, children) {
children.forEach(child => {
if (child) {
const element = typeof child === 'object' && child.tag ? 
this.createElement(child) : child;
parent.appendChild(element);
}
});
}
}
class ChrctrMngr {
constructor() {
this.characters = [
{ 
id: 1, 
name: "Rin", 
description: "A determined cultivator who refuses to give up", 
cards: [
{ id: 1, type: "Strength", title: "Unbreakable Spirit", description: "Despite ridicule, continues to train every day" },
{ id: 2, type: "Weakness", title: "Town Laughingstock", description: "Mocked by everyone for clumsy cultivation attempts" }
]
},
{ 
id: 2, 
name: "Qhaway", 
description: "Rin's loyal friend and supporter", 
cards: [
{ id: 3, type: "Strength", title: "Loyal Friend", description: "Only one who supports and comforts Rin" },
{ id: 4, type: "Strength", title: "Quiet Wisdom", description: "Sees potential where others see failure" }
]
}
];
this.currentChrctrId = 1;
this.editingCardId = null;
this.nextId = 5;
}
getCurrentChrctr() { 
return this.characters.find(c => c.id === this.currentChrctrId); 
}
addChrctr() {
const newChrctr = { 
id: this.nextId++, 
name: "New Chrctr", 
description: "Chrctr description", 
cards: [] 
};
this.characters.push(newChrctr);
this.currentChrctrId = newChrctr.id;
this.render();
}
updateChrctr(id, updates) {
const character = this.characters.find(c => c.id === id);
if (character) Object.assign(character, updates);
this.render();
}
deleteChrctr(id) {
this.characters = this.characters.filter(c => c.id !== id);
if (this.currentChrctrId === id) this.currentChrctrId = this.characters[0]?.id || null;
this.render();
}
addCard(characterId, card) {
const character = this.characters.find(c => c.id === characterId);
if (character) {
card.id = this.nextId++;
character.cards.push(card);
this.render();
}
}
updateCard(characterId, cardId, updates) {
const character = this.characters.find(c => c.id === characterId);
if (character) {
const card = character.cards.find(c => c.id === cardId);
if (card) Object.assign(card, updates);
this.render();
}
}
deleteCard(characterId, cardId) {
const character = this.characters.find(c => c.id === characterId);
if (character) character.cards = character.cards.filter(c => c.id !== cardId);
this.render();
}
renderChrctrList() {
const characterItems = this.characters.map(character => ({
tag: 'div',
className: stylRgstry.cls('characterItem', character.id === this.currentChrctrId ? 'active' : 'normal'),
events: {
click: () => { 
this.currentChrctrId = character.id; 
this.render(); 
},
mouseenter: (e) => {
if (character.id !== this.currentChrctrId) {
e.target.style.background = '#e9ecef';
}
},
mouseleave: (e) => {
if (character.id !== this.currentChrctrId) {
e.target.style.background = '#f5f7fa';
}
}
},
children: [
{ tag: 'h3', attributes: { textContent: character.name } },
{ tag: 'p', attributes: { textContent: character.description } }
]
}));
return {
tag: 'div',
className: stylRgstry.cls('characterList', 'main'),
children: [
{ tag: 'h2', attributes: { textContent: 'Chrctrs' } },
...characterItems,
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Add New Chrctr' },
events: { 
click: () => this.addChrctr(),
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
}
]
};
}
renderChrctrEditor() {
const character = this.getCurrentChrctr();
if (!character) {
return {
tag: 'div',
className: stylRgstry.cls('editor', 'main'),
attributes: { textContent: 'No character selected' }
};
}
const nameInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
value: character.name,
placeholder: 'Chrctr Name'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
value: character.description,
placeholder: 'Chrctr Description',
rows: '3'
}
});
return {
tag: 'div',
className: stylRgstry.cls('editor', 'main'),
children: [
{ tag: 'h2', attributes: { textContent: 'Edit Chrctr' } },
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
nameInput,
descTextarea,
{
tag: 'div',
className: stylRgstry.cls('formRow', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Save Changes' },
events: {
click: () => this.updateChrctr(character.id, { 
name: nameInput.value, 
description: descTextarea.value 
}),
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'danger'),
attributes: { textContent: 'Delete Chrctr' },
events: {
click: () => { 
if (confirm('Delete this character?')) this.deleteChrctr(character.id); 
},
mouseenter: (e) => e.target.style.background = '#c82333',
mouseleave: (e) => e.target.style.background = '#dc3545'
}
}
]
}
]
},
{ tag: 'hr' },
this.renderCardManager(character)
]
};
}
renderCardManager(character) {
const cardElements = character.cards.map(card => {
const isEditing = this.editingCardId === card.id;
if (isEditing) {
return this.renderCardEditForm(character.id, card);
} else {
return {
tag: 'div',
className: stylRgstry.cls('card', 'item'),
children: [
{
tag: 'div',
className: stylRgstry.cls('cardHeader', 'main'),
children: [
{
tag: 'div',
children: [
{ tag: 'strong', attributes: { textContent: card.type + ': ' } },
{ tag: 'span', attributes: { textContent: card.title } }
]
},
{
tag: 'div',
className: stylRgstry.cls('cardActions', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'secondary'),
attributes: { textContent: 'Edit' },
events: {
click: () => { 
this.editingCardId = card.id; 
this.render(); 
},
mouseenter: (e) => e.target.style.background = '#5a6268',
mouseleave: (e) => e.target.style.background = '#6c757d'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'danger'),
attributes: { textContent: 'Remove' },
events: { 
click: () => this.deleteCard(character.id, card.id),
mouseenter: (e) => e.target.style.background = '#c82333',
mouseleave: (e) => e.target.style.background = '#dc3545'
}
}
]
}
]
},
{ tag: 'p', attributes: { textContent: card.description } }
]
};
}
});
return {
tag: 'div',
children: [
{ tag: 'h3', attributes: { textContent: 'Attached Cards' } },
...cardElements,
this.renderAddCardForm(character.id)
]
};
}
renderCardEditForm(characterId, card) {
const typeSelect = DOMFactory.createElement({
tag: 'select',
className: stylRgstry.cls('input', 'select'),
children: ['Strength', 'Weakness', 'Subplot', 'Asset'].map(type => ({
tag: 'option',
attributes: { 
value: type, 
textContent: type,
selected: type === card.type
}
}))
});
const titleInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
value: card.title,
placeholder: 'Card Title'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
value: card.description,
placeholder: 'Card Description',
rows: '2'
}
});
return {
tag: 'div',
className: stylRgstry.cls('card', 'editing'),
children: [
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
typeSelect,
titleInput,
descTextarea,
{
tag: 'div',
className: stylRgstry.cls('formRow', 'main'),
children: [
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Save Card' },
events: {
click: () => {
this.updateCard(characterId, card.id, {
type: typeSelect.value,
title: titleInput.value,
description: descTextarea.value
});
this.editingCardId = null;
},
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
},
{
tag: 'button',
className: stylRgstry.cls('button', 'secondary'),
attributes: { textContent: 'Cancel' },
events: {
click: () => { 
this.editingCardId = null; 
this.render(); 
},
mouseenter: (e) => e.target.style.background = '#5a6268',
mouseleave: (e) => e.target.style.background = '#6c757d'
}
}
]
}
]
}
]
};
}
renderAddCardForm(characterId) {
const typeSelect = DOMFactory.createElement({
tag: 'select',
className: stylRgstry.cls('input', 'select'),
children: ['Strength', 'Weakness', 'Subplot', 'Asset'].map(type => ({
tag: 'option',
attributes: { value: type, textContent: type }
}))
});
const titleInput = DOMFactory.createElement({
tag: 'input',
className: stylRgstry.cls('input', 'text'),
attributes: {
type: 'text',
placeholder: 'Card Title'
}
});
const descTextarea = DOMFactory.createElement({
tag: 'textarea',
className: stylRgstry.cls('input', 'textarea'),
attributes: {
placeholder: 'Card Description',
rows: '2'
}
});
return {
tag: 'div',
children: [
{ tag: 'h4', attributes: { textContent: 'Add New Card' } },
{
tag: 'div',
className: stylRgstry.cls('form', 'main'),
children: [
typeSelect,
titleInput,
descTextarea,
{
tag: 'button',
className: stylRgstry.cls('button', 'primary'),
attributes: { textContent: 'Add Card' },
events: {
click: () => {
if (titleInput.value.trim()) {
this.addCard(characterId, {
type: typeSelect.value,
title: titleInput.value,
description: descTextarea.value
});
titleInput.value = '';
descTextarea.value = '';
}
},
mouseenter: (e) => e.target.style.background = '#3d5a91',
mouseleave: (e) => e.target.style.background = '#4a6fa5'
}
}
]
}
]
};
}
render() {
const app = document.getElementById('app');
app.innerHTML = '';
const mainStructure = {
tag: 'div',
className: stylRgstry.cls('container', 'main'),
children: [
{
tag: 'header',
className: stylRgstry.cls('header', 'main'),
children: [
{ tag: 'h1', attributes: { textContent: 'Chrctr Manager' } },
{ tag: 'p', attributes: { textContent: 'Advanced Framework - Storium-Style Chrctr & Card Management' } }
]
},
{
tag: 'div',
className: stylRgstry.cls('layout', 'main'),
children: [
this.renderChrctrList(),
this.renderChrctrEditor()
]
}
]
};
const mainElement = DOMFactory.createElement(mainStructure);
app.appendChild(mainElement);
}
}
importRegistry.register({ 
alias: 'ChrctrMngr', 
path: './ChrctrMngr.js', 
type: 'component', 
dependencies: ['StyleRegistry', 'DOMFactory'] 
});
importRegistry.register({ 
alias: 'DOMFactory', 
path: './DOMFactory.js', 
type: 'utility', 
dependencies: [] 
});
componentFactory.register('character-manager', ChrctrMngr);
componentFactory.register('dom-factory', DOMFactory);
const chrctrMngr = new ChrctrMngr();
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => chrctrMngr.render());
} else {
chrctrMngr.render();
}
</script>
</body>
</html>::: END TODO



*/

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
