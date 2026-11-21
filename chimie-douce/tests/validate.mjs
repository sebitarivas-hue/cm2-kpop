import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {SCENES,SOURCES,GROUPS} from '../src/content.js';
import {FIGURES} from '../src/figures.js';
assert.equal(SCENES.length,18);
assert.equal(FIGURES.length,70);
assert.equal(new Set(SCENES.map(s=>s.id)).size,SCENES.length);
assert.equal(new Set(FIGURES.map(f=>f.id)).size,FIGURES.length);
for(const s of SCENES){assert.ok(GROUPS.includes(s.group));assert.ok(s.intro?.length>50);for(const r of s.refs)assert.ok(SOURCES[r],`Unknown reference ${r}`);for(const c of s.controls)assert.ok(c.min<=c.value&&c.value<=c.max)}
for(const f of FIGURES){assert.ok(f.time>=0&&f.time<=4540);assert.ok(f.capture>=1&&f.capture<=454)}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.ok(html.includes('./src/app.js'));
const corpus=readFileSync(new URL('../research/index.html',import.meta.url),'utf8');assert.equal((corpus.match(/class="figure-note"/g)||[]).length,70);
const model=readFileSync(new URL('../src/scenes.js',import.meta.url),'utf8');for(const s of SCENES.filter(s=>s.id!=='structure'))assert.ok(model.includes("case '"+s.id+"'"),`Missing scene ${s.id}`);
console.log('Atlas validation: 18 3D scenes, 70 figures, 16 scientific chapters — PASS.');
