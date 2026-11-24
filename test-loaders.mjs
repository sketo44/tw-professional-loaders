import { Window } from 'happy-dom';
import fs from 'node:fs';

const window = new Window({ url: 'https://example.com/' });
for (const name of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'ShadowRoot', 'customElements', 'Document', 'CSSStyleSheet']) {
  globalThis[name] = name === 'window' ? window : window[name];
}

const { LitElement } = await import('lit');
LitElement.registerSallaComponent = function (tag) { customElements.define(tag, this); };
await import('./dist/professional-loader.js');

const manifest = JSON.parse(fs.readFileSync('./twilight-bundle.json', 'utf8'));
const options = manifest.components[0].fields.find((field) => field.id === 'style').options;
if (options.length !== 20) throw new Error(`Expected 20 manifest options, found ${options.length}`);

for (const { value } of options) {
  const component = document.createElement('salla-professional-loader');
  component.config = { style: value, title: 'جاري التحميل', show_title: 'yes', background: 'auto', min_height: '320' };
  document.body.append(component);
  await component.updateComplete;
  const root = component.shadowRoot;
  const section = root?.querySelector('[data-loader-id]');
  const stage = root?.querySelector('.loader-stage');
  if (!root || section?.getAttribute('data-loader-id') !== value) throw new Error(`${value}: wrong rendered variant`);
  if (!root.textContent.includes('جاري التحميل')) throw new Error(`${value}: title render failed`);
  if (!stage || !stage.querySelector('style') || stage.children.length < 2) throw new Error(`${value}: loader markup/styles missing`);
  component.config = { style: value, show_title: 'no', background: 'transparent', min_height: '100' };
  await component.updateComplete;
  if (root.querySelector('.loader-title')) throw new Error(`${value}: title visibility failed`);
  if (!root.querySelector('.loader-stage.transparent') || !root.querySelector('.loader-stage')?.getAttribute('style')?.includes('200px')) throw new Error(`${value}: settings validation failed`);
  component.remove();
  console.log(`${value}: render passed`);
}
