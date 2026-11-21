#!/usr/bin/env node
/**
 * Read-only i18n coverage audit. Run: node chimie-douce/tools/audit-i18n.mjs
 * Measures stored dictionaries, NOT machine translation success.
 */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=name=>readFileSync(path.join(root,name),'utf8');
const parseJsonExport=(source,symbol)=>{
 const start=source.indexOf('export const '+symbol+'=');
 if(start<0)throw Error('Cannot find export '+symbol);
 const from=start+('export const '+symbol+'=').length;
 let begin=from;while(/\s/.test(source[begin]))begin++;
 const opener=source[begin],close=opener==='['?']':'}';
 if(!['[','{'].includes(opener))throw Error('Unsupported JSON export: '+symbol);
 let depth=0,inString=false,escaped=false,end=-1;
 for(let i=begin;i<source.length;i++){
  const c=source[i];
  if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')inString=false;continue}
  if(c==='"'){inString=true;continue}
  if(c===opener)depth++;
  if(c===close&&--depth===0){end=i+1;break}
 }
 if(end<0)throw Error('Unclosed export '+symbol);
 return JSON.parse(source.slice(begin,end));
};
const figureSource=file('src/figures.js');
const figures=parseJsonExport(figureSource,'FIGURES');
const graph=file('src/knowledge-graph.js');
const concepts=parseJsonExport(graph,'CONCEPTS');
const dictionaries={
 concepts:parseJsonExport(file('concept-label-locales.js'),'CONCEPT_LABELS'),
 home:parseJsonExport(file('home-locales.js'),'HOME_TERMS'),
 ui:parseJsonExport(file('interface-locales.js'),'INTERFACE_TERMS'),
 figureTitles:parseJsonExport(file('figure-title-locales.js'),'FIGURE_TITLE_TERMS')
};
const chapterText=file('chapter-locales.js');
const scienceText=file('science-locales.js');
const locales=['en','es','it','zh'];
const chapters=[...new Set(figures.map(f=>f.chapter))];
const valid=row=>locales.every(lang=>typeof row?.[lang]==='string'&&row[lang].trim().length>0);
const matched=(items,map)=>items.filter(k=>valid(map[k]));
const conceptNames=concepts.map(c=>c.label);
const translatedConceptNames=matched(conceptNames,dictionaries.concepts);
const homeKeys=Object.keys(dictionaries.home),uiKeys=Object.keys(dictionaries.ui);
const stats={
 conceptNames:{translated:translatedConceptNames.length,total:conceptNames.length,missing:conceptNames.filter(k=>!valid(dictionaries.concepts[k]))},
 homeStrings:{translated:matched(homeKeys,dictionaries.home).length,total:homeKeys.length},
 interfaceStrings:{translated:matched(uiKeys,dictionaries.ui).length,total:uiKeys.length},
 figures:{total:figures.length,translatedTitles:matched(figures.map(f=>f.title),dictionaries.figureTitles).length,missingTitles:figures.map(f=>f.title).filter(k=>!valid(dictionaries.figureTitles[k])),translatedScientificNotes:0},
 chapters:{total:chapters.length,chapterDictionaryPresent:chapterText.includes('CHAPTER_TERMS')},
 scientificLongForm:{monographHasDedicatedTranslatedVersions:false},
 runtimeMachineTranslation:'fallback only; not counted as persisted translation'
};
console.log(JSON.stringify(stats,null,2));
if(stats.conceptNames.missing.length||stats.homeStrings.translated!==stats.homeStrings.total||stats.interfaceStrings.translated!==stats.interfaceStrings.total||stats.figures.missingTitles.length)process.exitCode=1;
