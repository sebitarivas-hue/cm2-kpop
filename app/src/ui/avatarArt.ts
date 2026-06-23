import type { AvatarConfig } from '../state/store';

/**
 * Générateur d'illustration d'avatar — style idole K-pop (webtoon).
 * Produit du SVG en chaîne (réutilisé en React, dans le HUD et en texture Phaser).
 * Toutes les couleurs de base sont solides ; le relief vient d'un dégradé
 * d'ombrage translucide superposé (pas de calcul de couleur).
 */

// ---- Palettes proposées dans le créateur -----------------------------------
export const PEAUX = ['#ffe0c4', '#f6cbaa', '#f1c9a5', '#e3a977', '#c2895a', '#9c6b43', '#6e4a2f'];
export const CHEVEUX = ['#1a1320', '#2a1a3a', '#5b3a1e', '#a8631f', '#d9a441', '#e7e3ea', '#ff5fa2', '#7c5cff', '#3ad1c4', '#ff7a45'];
export const MECHES = ['#ff5fa2', '#ffd76b', '#7c5cff', '#3ad1c4', '#ff4d4d', '#e7e3ea', '#2a1a3a'];
export const YEUX = ['#5b3a2a', '#7b4a2a', '#3a6b8c', '#3a8c6b', '#7c4ad1', '#b03a5a', '#3a3a44'];
export const TENUES = ['#ff4d8d', '#7c5cff', '#18d3ff', '#36c47e', '#ffd36b', '#ff7a45', '#e7e3ea', '#1b1b2a'];

export const COIFFURES: { id: AvatarConfig['coiffure']; label: string }[] = [
  { id: 'idol_long', label: 'Idol long' },
  { id: 'wolfcut', label: 'Wolf cut' },
  { id: 'twin', label: 'Couettes' },
  { id: 'bob', label: 'Carré' },
  { id: 'updo', label: 'Queue haute' },
  { id: 'mullet', label: 'Mullet' },
];
export const STYLES: { id: AvatarConfig['style']; label: string }[] = [
  { id: 'scene', label: 'Scène ✨' },
  { id: 'bomber', label: 'Bomber' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'crop', label: 'Crop' },
];
export const ACCESSOIRES: { id: AvatarConfig['accessoire']; label: string }[] = [
  { id: 'aucun', label: '—' },
  { id: 'boucles', label: 'Boucles 💎' },
  { id: 'choker', label: 'Choker' },
  { id: 'casque', label: 'Casque 🎧' },
  { id: 'lunettes', label: 'Lunettes 🕶️' },
  { id: 'cap', label: 'Casquette' },
  { id: 'couronne', label: 'Couronne 👑' },
];

const LIP1 = '#ff95b3';
const LIP2 = '#d24d72';

// ---- Briques ----------------------------------------------------------------
function defs(a: AvatarConfig, u: string): string {
  return `
  <defs>
    <linearGradient id="sh${u}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
    </linearGradient>
    <radialGradient id="ir${u}" cx="0.4" cy="0.35" r="0.75">
      <stop offset="0" stop-color="${a.yeux}" stop-opacity="0.7"/>
      <stop offset="0.55" stop-color="${a.yeux}"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="lp${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${LIP1}"/>
      <stop offset="1" stop-color="${LIP2}"/>
    </linearGradient>
    <linearGradient id="mt${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff6cf"/>
      <stop offset="0.45" stop-color="#ffd76b"/>
      <stop offset="1" stop-color="#b8860b"/>
    </linearGradient>
    <linearGradient id="gl${u}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#6b6b8a"/>
      <stop offset="1" stop-color="#0c0c18"/>
    </linearGradient>
    <radialGradient id="au${u}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${a.meches}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${a.meches}" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
}

function outfit(a: AvatarConfig, u: string): string {
  const base = `M26,250 C30,206 54,190 100,190 C146,190 170,206 174,250 Z`;
  let extra = '';
  if (a.style === 'scene') {
    extra = `
      <path d="M70,192 L100,210 L130,192" fill="none" stroke="url(#mt${u})" stroke-width="3"/>
      <path d="M100,210 L100,250" stroke="url(#mt${u})" stroke-width="2" opacity="0.8"/>
      <g fill="#ffffff">
        <path d="M58,214 l2,4 l4,2 l-4,2 l-2,4 l-2,-4 l-4,-2 l4,-2 z" opacity="0.9"/>
        <path d="M142,220 l1.5,3 l3,1.5 l-3,1.5 l-1.5,3 l-1.5,-3 l-3,-1.5 l3,-1.5 z" opacity="0.85"/>
        <circle cx="120" cy="236" r="1.6" opacity="0.8"/>
        <circle cx="80" cy="236" r="1.4" opacity="0.7"/>
      </g>`;
  } else if (a.style === 'bomber') {
    extra = `
      <path d="M70,196 Q100,206 130,196 L132,250 L68,250 Z" fill="#000000" opacity="0.18"/>
      <rect x="96" y="200" width="8" height="50" rx="2" fill="#000000" opacity="0.25"/>
      <g stroke="#ffffff" stroke-width="0.8" opacity="0.4">
        <line x1="100" y1="206" x2="100" y2="248"/></g>
      <path d="M58,210 L58,250 M142,210 L142,250" stroke="#000000" stroke-width="3" opacity="0.18"/>`;
  } else if (a.style === 'hoodie') {
    extra = `
      <path d="M66,196 Q60,176 84,172 Q92,186 100,186 Q108,186 116,172 Q140,176 134,196 Z" fill="#000000" opacity="0.15"/>
      <path d="M92,186 L88,214 M108,186 L112,214" stroke="#f4f4f8" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>
      <circle cx="88" cy="216" r="2.2" fill="#f4f4f8"/><circle cx="112" cy="216" r="2.2" fill="#f4f4f8"/>
      <path d="M78,236 Q100,244 122,236" fill="none" stroke="#000000" stroke-width="1.4" opacity="0.2"/>`;
  } else {
    // crop : veste ouverte + décolleté
    extra = `
      <path d="M92,188 L72,250 L40,250 C44,212 64,194 92,188 Z" fill="#000000" opacity="0.16"/>
      <path d="M108,188 L128,250 L160,250 C156,212 136,194 108,188 Z" fill="#000000" opacity="0.16"/>`;
  }
  return `
    <path d="${base}" fill="${a.tenue}"/>
    <path d="${base}" fill="url(#sh${u})"/>
    ${extra}`;
}

function backHair(a: AvatarConfig, u: string): string {
  const c = a.cheveux;
  const blob = `<ellipse cx="100" cy="90" rx="54" ry="60" fill="${c}"/>
    <ellipse cx="100" cy="90" rx="54" ry="60" fill="url(#sh${u})"/>`;
  let sides = '';
  switch (a.coiffure) {
    case 'idol_long':
      sides = `<path d="M50,96 C44,150 46,196 52,224 L80,224 C74,190 74,150 78,110 Z" fill="${c}"/>
        <path d="M150,96 C156,150 154,196 148,224 L120,224 C126,190 126,150 122,110 Z" fill="${c}"/>
        <path d="M50,96 C44,150 46,196 52,224 L80,224 C74,190 74,150 78,110 Z" fill="url(#sh${u})"/>
        <path d="M150,96 C156,150 154,196 148,224 L120,224 C126,190 126,150 122,110 Z" fill="url(#sh${u})"/>`;
      break;
    case 'bob':
      sides = `<path d="M52,96 C50,128 54,150 58,158 L78,156 C74,134 76,112 80,104 Z" fill="${c}"/>
        <path d="M148,96 C150,128 146,150 142,158 L122,156 C126,134 124,112 120,104 Z" fill="${c}"/>`;
      break;
    case 'wolfcut':
      sides = `<path d="M50,96 C44,140 48,176 54,196 L74,190 L70,150 L80,110 Z" fill="${c}"/>
        <path d="M150,96 C156,140 152,176 146,196 L126,190 L130,150 L120,110 Z" fill="${c}"/>
        <g fill="${c}"><path d="M54,150 l-8,18 l10,-6 z"/><path d="M146,150 l8,18 l-10,-6 z"/>
        <path d="M58,186 l-6,14 l9,-5 z"/><path d="M142,186 l6,14 l-9,-5 z"/></g>`;
      break;
    case 'twin':
      sides = `<ellipse cx="44" cy="150" rx="20" ry="30" fill="${c}"/>
        <ellipse cx="156" cy="150" rx="20" ry="30" fill="${c}"/>
        <ellipse cx="44" cy="150" rx="20" ry="30" fill="url(#sh${u})"/>
        <ellipse cx="156" cy="150" rx="20" ry="30" fill="url(#sh${u})"/>
        <path d="M58,108 Q48,120 46,134 L60,130 Z" fill="${c}"/>
        <path d="M142,108 Q152,120 154,134 L140,130 Z" fill="${c}"/>`;
      break;
    case 'updo':
      sides = `<ellipse cx="100" cy="48" rx="20" ry="16" fill="${c}"/>
        <ellipse cx="100" cy="48" rx="20" ry="16" fill="url(#sh${u})"/>
        <path d="M120,52 Q150,64 150,150 L140,150 Q138,80 116,62 Z" fill="${c}"/>`;
      break;
    case 'mullet':
      sides = `<path d="M58,108 Q52,120 54,140 L70,130 Z" fill="${c}"/>
        <path d="M142,108 Q148,120 146,140 L130,130 Z" fill="${c}"/>
        <path d="M82,150 C80,180 84,206 90,226 L110,226 C116,206 120,180 118,150 Z" fill="${c}"/>
        <path d="M82,150 C80,180 84,206 90,226 L110,226 C116,206 120,180 118,150 Z" fill="url(#sh${u})"/>`;
      break;
  }
  return blob + sides;
}

function head(a: AvatarConfig, u: string): string {
  const p = a.peau;
  const path = `M66,98 C60,64 80,48 100,48 C120,48 140,64 134,98 C139,120 130,140 116,154 C110,161 105,167 100,168 C95,167 90,161 84,154 C70,140 61,120 66,98 Z`;
  return `
    <ellipse cx="100" cy="150" rx="18" ry="8" fill="#000000" opacity="0.12"/>
    <path d="M90,150 L90,176 Q100,183 110,176 L110,150 Z" fill="${p}"/>
    <ellipse cx="66" cy="112" rx="8" ry="11" fill="${p}"/>
    <ellipse cx="134" cy="112" rx="8" ry="11" fill="${p}"/>
    <ellipse cx="66" cy="112" rx="3.5" ry="6" fill="#000000" opacity="0.12"/>
    <ellipse cx="134" cy="112" rx="3.5" ry="6" fill="#000000" opacity="0.12"/>
    <path d="${path}" fill="${p}"/>
    <path d="${path}" fill="url(#sh${u})"/>`;
}

/** Œil + sourcil + blush, dessinés côté gauche (sera dupliqué en miroir). */
function sideFeatures(a: AvatarConfig, u: string): string {
  return `
    <ellipse cx="76" cy="128" rx="9" ry="5" fill="#ff7a9c" opacity="0.32"/>
    <path d="M68,100 Q80,94 92,98 Q84,99 76,101 Z" fill="${a.meches}" opacity="0.22"/>
    <path d="M69,96 Q81,89 93,95" fill="none" stroke="${a.cheveux}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M71,110 Q82,101 93,108" fill="none" stroke="#2a1f2a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M71,110 Q68,110 66,113" fill="none" stroke="#2a1f2a" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="82" cy="112" rx="9.5" ry="6.4" fill="#ffffff"/>
    <circle cx="83" cy="112" r="6" fill="url(#ir${u})"/>
    <circle cx="83" cy="112" r="6" fill="none" stroke="#000000" stroke-opacity="0.25" stroke-width="1.2"/>
    <circle cx="83" cy="112" r="2.8" fill="#1a1016"/>
    <circle cx="80.5" cy="109.5" r="2.1" fill="#ffffff"/>
    <circle cx="85" cy="114.5" r="1" fill="#ffffff" opacity="0.8"/>
    <path d="M73,116.5 Q82,120 91,115.5" fill="none" stroke="#6b4a55" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>
    <path d="M73,105 Q82,100 92,104" fill="none" stroke="#000000" stroke-opacity="0.16" stroke-width="1.1"/>`;
}

function faceCenter(u: string): string {
  return `
    <path d="M98,116 Q96,123 100,125 Q104,124 102,120" fill="none" stroke="#000000" stroke-opacity="0.18" stroke-width="1.3"/>
    <ellipse cx="98" cy="125" rx="1.1" ry="0.8" fill="#000000" opacity="0.16"/>
    <ellipse cx="102" cy="125" rx="1.1" ry="0.8" fill="#000000" opacity="0.16"/>
    <path d="M86,133 Q100,128 114,133 Q108,141 100,142 Q92,141 86,133 Z" fill="url(#lp${u})"/>
    <path d="M88,134 Q100,137 112,134" fill="none" stroke="#a83a59" stroke-width="1.1" opacity="0.6"/>
    <path d="M94,138.5 Q100,140.5 106,138.5" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>`;
}

function frontHair(a: AvatarConfig): string {
  const c = a.cheveux;
  const m = a.meches;
  const sheen = (d: string) => `<path d="${d}" fill="none" stroke="${m}" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>`;
  switch (a.coiffure) {
    case 'idol_long':
      return `
        <path d="M100,50 C78,50 62,66 64,98 C72,80 86,70 96,66 C92,80 86,96 76,108 C90,96 98,76 100,60 Z" fill="${c}"/>
        <path d="M100,50 C122,50 138,66 136,98 C128,80 114,70 104,66 C108,80 114,96 124,108 C110,96 102,76 100,60 Z" fill="${c}"/>
        <path d="M100,52 C92,52 84,60 82,76 Q100,66 118,76 C116,60 108,52 100,52 Z" fill="${c}"/>
        ${sheen('M90,64 Q84,82 80,100')}${sheen('M110,64 Q116,82 120,100')}`;
    case 'wolfcut':
      return `
        <g fill="${c}">
          <path d="M64,96 L74,66 L80,92 Z"/><path d="M78,92 L88,62 L94,90 Z"/>
          <path d="M94,90 L100,60 L106,90 Z"/><path d="M106,90 L112,62 L122,92 Z"/>
          <path d="M120,92 L126,66 L136,96 Z"/>
        </g>
        ${sheen('M86,70 Q84,84 84,94')}${sheen('M114,70 Q116,84 116,94')}`;
    case 'bob':
      return `
        <path d="M64,96 C62,72 78,54 100,54 C122,54 138,72 136,96 C128,78 118,70 100,70 C82,70 72,78 64,96 Z" fill="${c}"/>
        <path d="M66,92 Q72,84 80,88 Q88,82 96,87 Q104,82 112,88 Q120,84 134,92 L134,96 Q100,84 66,96 Z" fill="${c}"/>
        ${sheen('M84,64 Q82,78 82,90')}${sheen('M116,64 Q118,78 118,90')}`;
    case 'updo':
      return `
        <path d="M66,92 C66,66 82,52 100,52 C118,52 134,66 134,92 C128,74 118,66 100,66 C92,66 86,68 82,74 C76,68 70,76 66,92 Z" fill="${c}"/>
        <path d="M118,60 Q108,58 100,66 Q112,62 122,72 Z" fill="${c}"/>
        ${sheen('M96,58 Q110,60 124,72')}`;
    case 'twin':
      return `
        <path d="M100,52 C84,52 70,64 68,90 Q84,72 100,70 Q116,72 132,90 C130,64 116,52 100,52 Z" fill="${c}"/>
        <path d="M100,54 C94,54 88,60 86,72 Q100,66 114,72 C112,60 106,54 100,54 Z" fill="${c}"/>
        ${sheen('M86,62 Q82,76 80,88')}${sheen('M114,62 Q118,76 120,88')}`;
    case 'mullet':
      return `
        <path d="M64,94 C62,70 80,56 100,56 C120,56 138,70 136,94 C126,76 116,70 100,70 C84,70 74,76 64,94 Z" fill="${c}"/>
        <path d="M70,86 Q86,72 100,74 Q114,72 130,86 L130,90 Q100,76 70,90 Z" fill="${c}"/>
        ${sheen('M82,64 Q80,80 80,92')}${sheen('M118,64 Q120,80 120,92')}`;
  }
}

function accessoire(a: AvatarConfig, u: string): string {
  switch (a.accessoire) {
    case 'boucles':
      return `
        <g>
          <line x1="64" y1="121" x2="64" y2="129" stroke="url(#mt${u})" stroke-width="1.4"/>
          <path d="M64,129 l3,4 l-3,4 l-3,-4 z" fill="url(#mt${u})"/>
          <line x1="136" y1="121" x2="136" y2="129" stroke="url(#mt${u})" stroke-width="1.4"/>
          <path d="M136,129 l3,4 l-3,4 l-3,-4 z" fill="url(#mt${u})"/>
        </g>`;
    case 'choker':
      return `
        <path d="M88,168 Q100,176 112,168" fill="none" stroke="#15131c" stroke-width="5" stroke-linecap="round"/>
        <path d="M100,173 l3,5 l-3,4 l-3,-4 z" fill="url(#mt${u})"/>`;
    case 'casque':
      return `
        <path d="M58,104 Q100,40 142,104" fill="none" stroke="#1b1b26" stroke-width="7" stroke-linecap="round"/>
        <rect x="50" y="104" width="18" height="26" rx="7" fill="#22222f"/>
        <rect x="132" y="104" width="18" height="26" rx="7" fill="#22222f"/>
        <rect x="54" y="109" width="10" height="16" rx="4" fill="${a.meches}" opacity="0.9"/>
        <rect x="136" y="109" width="10" height="16" rx="4" fill="${a.meches}" opacity="0.9"/>`;
    case 'lunettes':
      return `
        <g>
          <rect x="70" y="104" width="22" height="15" rx="6" fill="url(#gl${u})" stroke="#0c0c16" stroke-width="1.5"/>
          <rect x="108" y="104" width="22" height="15" rx="6" fill="url(#gl${u})" stroke="#0c0c16" stroke-width="1.5"/>
          <line x1="92" y1="109" x2="108" y2="109" stroke="#0c0c16" stroke-width="2"/>
          <line x1="70" y1="107" x2="58" y2="104" stroke="#0c0c16" stroke-width="2"/>
          <line x1="130" y1="107" x2="142" y2="104" stroke="#0c0c16" stroke-width="2"/>
          <path d="M73,107 l6,0 l-4,5 z" fill="#ffffff" opacity="0.35"/>
          <path d="M111,107 l6,0 l-4,5 z" fill="#ffffff" opacity="0.35"/>
        </g>`;
    case 'cap':
      return `
        <path d="M60,82 C62,58 80,46 100,46 C120,46 138,58 140,82 C120,70 80,70 60,82 Z" fill="${a.tenue}"/>
        <path d="M60,82 C80,72 120,72 140,82 L150,86 C120,80 80,80 60,82 Z" fill="${a.tenue}"/>
        <path d="M58,82 C80,72 122,72 150,86 L152,90 C120,80 80,80 58,86 Z" fill="#000000" opacity="0.2"/>
        <circle cx="100" cy="52" r="2.5" fill="#000000" opacity="0.3"/>`;
    case 'couronne':
      return `
        <path d="M74,60 L80,44 L90,56 L100,40 L110,56 L120,44 L126,60 Z" fill="url(#mt${u})" stroke="#8a6a12" stroke-width="0.8"/>
        <circle cx="100" cy="50" r="2.4" fill="#ff5fa2"/>
        <circle cx="84" cy="55" r="1.8" fill="#3ad1c4"/>
        <circle cx="116" cy="55" r="1.8" fill="#7c5cff"/>`;
    default:
      return '';
  }
}

/** SVG interne (sans la balise <svg>). */
export function avatarInner(a: AvatarConfig, uid = 'a'): string {
  const u = uid.replace(/[^a-z0-9]/gi, '');
  const left = sideFeatures(a, u);
  return `<g>
    ${defs(a, u)}
    ${outfit(a, u)}
    ${backHair(a, u)}
    ${head(a, u)}
    ${left}
    <g transform="translate(200,0) scale(-1,1)">${left}</g>
    ${faceCenter(u)}
    ${frontHair(a)}
    ${accessoire(a, u)}
  </g>`;
}

/** Document SVG complet (pour rasterisation Phaser / data-URI). */
export function avatarSvgDoc(a: AvatarConfig, px = 200): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" width="${px}" height="${px * 1.25}">${avatarInner(
    a,
    'p',
  )}</svg>`;
}
