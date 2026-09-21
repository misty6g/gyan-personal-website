import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Reads a text file safely from the project root.
 */
export function readProjectFile(relPath) {
  const fullPath = path.resolve(PROJECT_ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Checks if a file exists relative to project root.
 */
export function fileExists(relPath) {
  return fs.existsSync(path.resolve(PROJECT_ROOT, relPath));
}

/**
 * Recursively find all files in a directory matching an extension.
 */
export function findFiles(dirRelPath, extensions = ['.js', '.jsx', '.css', '.html', '.md', '.json']) {
  const dirFullPath = path.resolve(PROJECT_ROOT, dirRelPath);
  if (!fs.existsSync(dirFullPath)) return [];

  const results = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.agents') {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(path.relative(PROJECT_ROOT, fullPath));
        }
      }
    }
  }
  walk(dirFullPath);
  return results;
}

/**
 * WCAG 2.1 Relative Luminance calculation.
 * Formula: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function parseColorToRgb(colorStr) {
  if (!colorStr) return null;
  const str = colorStr.trim().toLowerCase();

  // Hex format: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
  }

  // rgb/rgba format: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Named colors
  const namedColors = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    transparent: { r: 0, g: 0, b: 0 },
  };
  if (namedColors[str]) return namedColors[str];

  return null;
}

export function calculateLuminance(rgb) {
  if (!rgb) return 0;
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function calculateContrastRatio(colorA, colorB) {
  const rgbA = typeof colorA === 'string' ? parseColorToRgb(colorA) : colorA;
  const rgbB = typeof colorB === 'string' ? parseColorToRgb(colorB) : colorB;

  if (!rgbA || !rgbB) return 1;

  const lumA = calculateLuminance(rgbA);
  const lumB = calculateLuminance(rgbB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * CSS Rule Parser. Extracts rules, media queries, and properties.
 */
export function extractCssDeclarations(cssContent, selectorPattern) {
  const declarations = [];
  if (!cssContent) return declarations;

  // Strip CSS comments
  const cleanCss = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');

  // Extract rules matching selector
  const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match;
  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    const selectors = match[1].trim();
    const body = match[2].trim();

    let matched = false;
    if (typeof selectorPattern === 'string') {
      matched = selectors.includes(selectorPattern);
    } else if (selectorPattern instanceof RegExp) {
      matched = selectorPattern.test(selectors);
    }

    if (matched) {
      const props = {};
      body.split(';').forEach((decl) => {
        const colonIdx = decl.indexOf(':');
        if (colonIdx > 0) {
          const propName = decl.slice(0, colonIdx).trim().toLowerCase();
          const propVal = decl.slice(colonIdx + 1).trim();
          props[propName] = propVal;
        }
      });
      declarations.push({ selectors, props });
    }
  }

  return declarations;
}

/**
 * Extracts all CSS Custom Properties (variables) defined in :root or selectors.
 */
export function extractCssVariables(cssContent, selector = ':root') {
  const vars = {};
  const rules = extractCssDeclarations(cssContent, selector);
  for (const rule of rules) {
    for (const [key, val] of Object.entries(rule.props)) {
      if (key.startsWith('--')) {
        vars[key] = val;
      }
    }
  }
  return vars;
}

/**
 * Extracts media query blocks.
 */
export function extractMediaQueries(cssContent) {
  const mediaQueries = [];
  const cleanCss = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
  const mqRegex = /@media\s*([^{]+)\{([\s\S]*?\}\s*)\}/g;
  let match;
  while ((match = mqRegex.exec(cleanCss)) !== null) {
    mediaQueries.push({
      condition: match[1].trim(),
      body: match[2].trim(),
    });
  }
  return mediaQueries;
}

/**
 * Simple HTML tag and attribute extractor.
 */
export function extractMetaTags(htmlContent) {
  const tags = [];
  if (!htmlContent) return tags;
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let match;
  while ((match = metaRegex.exec(htmlContent)) !== null) {
    const attrString = match[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9:_-]+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    tags.push(attrs);
  }
  return tags;
}

/**
 * Word count utility.
 */
export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Em-dash audit: finds any em-dash (U+2014, '—') or entity occurrences.
 */
export function findEmDashes(content) {
  const matches = [];
  const lines = (content || '').split('\n');
  lines.forEach((line, lineIdx) => {
    if (line.includes('—') || line.includes('&mdash;') || line.includes('\u2014')) {
      matches.push({
        lineNumber: lineIdx + 1,
        lineContent: line.trim(),
      });
    }
  });
  return matches;
}
