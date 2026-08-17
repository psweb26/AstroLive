import fs from 'fs';
import path from 'path';

export type OntologyEntry = {
  category: string;
  subcategory: string;
  aliases: string[]; // normalized phrases
  suggestedConsultation: string;
  primaryNeed: string;
};

let _ontology: OntologyEntry[] | null = null;

function parseCsvRow(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function normalizeAlias(a: string) {
  return a
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function loadOntology(): OntologyEntry[] {
  if (_ontology) return _ontology;
  const csvPath = path.resolve(process.cwd(), 'datasets', 'concern_ontology.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = lines.shift();
  _ontology = lines.map((line) => {
    const parts = parseCsvRow(line);
    // Category,Subcategory,Aliases,SuggestedConsultation,PrimaryNeed
    const [category, subcategory, aliasesRaw, suggestedConsultation, primaryNeed] = parts;
    const aliases = (aliasesRaw || '')
      .split('|')
      .map((a) => normalizeAlias(a))
      .filter(Boolean);
    return {
      category: (category || '').trim(),
      subcategory: (subcategory || '').trim(),
      aliases,
      suggestedConsultation: (suggestedConsultation || '').trim(),
      primaryNeed: (primaryNeed || '').trim(),
    } as OntologyEntry;
  });
  return _ontology;
}

export function getAllAliases(): { phrase: string; category: string; subcategory: string; primaryNeed: string; suggestedConsultation: string }[] {
  const ont = loadOntology();
  const out: { phrase: string; category: string; subcategory: string; primaryNeed: string; suggestedConsultation: string }[] = [];
  ont.forEach((e) => {
    e.aliases.forEach((a) => out.push({ phrase: a, category: e.category, subcategory: e.subcategory, primaryNeed: e.primaryNeed, suggestedConsultation: e.suggestedConsultation }));
  });
  // sort by phrase length desc so longer phrases match first
  out.sort((a, b) => b.phrase.length - a.phrase.length);
  return out;
}
