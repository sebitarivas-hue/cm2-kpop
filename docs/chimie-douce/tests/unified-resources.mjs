import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {SCENES} from '../src/content.js';
import {FIGURES} from '../src/figures.js';
import {SCENE_RESOURCE_MAP,CONCEPTS,CONCEPT_BY_ID,LECTURE_ONLY_PLATES,plateAsset,sceneResources} from '../src/knowledge-graph.js';

assert.equal(SCENES.length,18,'18 scenes documented');
assert.equal(FIGURES.length,70,'70 original slide records');
assert.equal(CONCEPTS.length,38,'38 defined concepts');
assert.equal(new Set(CONCEPTS.map(x=>x.id)).size,CONCEPTS.length,'canonical unique concept IDs');
assert.equal(new Set(FIGURES.map(x=>x.id)).size,70,'no repeated plate ID');
assert.deepEqual(Object.keys(SCENE_RESOURCE_MAP).sort(),SCENES.map(x=>x.id).sort(),'all scenes mapped exactly once');
const ids=new Set();
for(const f of FIGURES){
 assert.ok(f.title&&f.chapter&&Number.isInteger(f.time),'source title, chapter, timestamp');
 assert.ok(existsSync(fileURLToPath(plateAsset(f.id))),'original image exists for '+f.id);
}
for(const scene of SCENES){
 const r=sceneResources(scene.id),m=SCENE_RESOURCE_MAP[scene.id];
 assert.ok(r&&m.plates.length>0,'scene source link '+scene.id);
 assert.equal(m.plates.length,new Set(m.plates).size,'no repeated illustration within scene '+scene.id);
 for(const id of m.plates){assert.ok(FIGURES.some(f=>f.id===id));ids.add(id)}
 for(const id of m.terms)assert.ok(CONCEPT_BY_ID[id],'defined concept '+id);
 for(const source of r.sources)assert.ok(source.name&&source.url);
}
for(const c of CONCEPTS){
 assert.ok(c.simple.length>45 && c.detail.length>70,'substantive definition '+c.id);
 assert.ok(SCENE_RESOURCE_MAP[c.scene]?.terms.includes(c.id),'backlink for '+c.id);
}
for(const f of FIGURES)assert.ok(ids.has(f.id)||LECTURE_ONLY_PLATES.includes(f.id),'unclassified plate '+f.id);
assert.deepEqual(LECTURE_ONLY_PLATES,[1,4,69,70],'honest introductory/concluding plates');
assert.deepEqual(SCENE_RESOURCE_MAP.cellulose.plates,[58,59,60,64],'cellulose image and chapter mapping');
console.log('PASS: 70 unique originals, 18 dossiers, 38 canonical concepts, 66 linked figures + 4 lecture-only.');
