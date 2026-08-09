import fs from 'fs';
import path from 'path';
import { AstrologerRecord, ConsultationStyle } from './types';

/**
 * Parse datasets/astrologers.csv into AstrologerRecord[].
 * This loader runs at server startup and returns an immutable list.
 *
 * IMPORTANT: Trust score is NOT parsed from the CSV.
 * Trust is always computed dynamically from raw component fields.
 */

function parseBoolean(val: string): boolean {
  return val.toLowerCase() === 'true';
}

function parseNumberList(val: string): number[] {
  return (val || '')
    .split('|')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

function parseStringList(val: string): string[] {
  return (val || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

let _astrologersCache: AstrologerRecord[] | null = null;

export function loadAstrologers(): readonly AstrologerRecord[] {
  if (_astrologersCache) return _astrologersCache;

  const csvPath = path.resolve(process.cwd(), 'datasets', 'astrologers.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);

  // Skip header
  const header = lines.shift();
  if (!header) throw new Error('astrologers.csv is empty');

  const headerFields = header.split(',');
  // Expected columns (per PRODUCT_SPEC):
  // id,name,specializations,methods,consultation_style,experience_years,verified_consultations_count,
  // repeat_client_pct,completion_rate_pct,verification_docs_present,languages,price_min,price_max,
  // available_slots,short_description

  const astrologers: AstrologerRecord[] = [];

  for (const line of lines) {
    const values = line.split(',');
    if (values.length < 15) {
      // Skip malformed lines
      console.warn(`Skipping malformed astrologer line: ${line.substring(0, 50)}...`);
      continue;
    }

    const record: AstrologerRecord = {
      id: values[0].trim(),
      name: values[1].trim(),
      short_bio: values[15]?.trim() || '',
      specializations: parseStringList(values[2]),
      methods: parseStringList(values[3]),
      consultation_style: (values[4].trim() as ConsultationStyle) || 'Practical',
      experience_years: parseInt(values[5].trim(), 10) || 0,
      verified_consultations_count: parseInt(values[6].trim(), 10) || 0,
      repeat_client_pct: parseInt(values[7].trim(), 10) || 0,
      completion_rate_pct: parseInt(values[8].trim(), 10) || 0,
      verification_docs_present: parseBoolean(values[9]),
      languages: parseStringList(values[10]),
      price_min: parseInt(values[11].trim(), 10) || 0,
      price_max: parseInt(values[12].trim(), 10) || 0,
      available_slots: parseStringList(values[13]),
      short_description: values[14]?.trim() || '',
    };

    astrologers.push(Object.freeze(record));
  }

  _astrologersCache = Object.freeze(astrologers);
  return _astrologersCache;
}

export function getAstrologer(id: string): AstrologerRecord | undefined {
  const astrologers = loadAstrologers();
  return astrologers.find((a) => a.id === id);
}

export function getAllAstrologers(): readonly AstrologerRecord[] {
  return loadAstrologers();
}
