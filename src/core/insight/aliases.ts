import { getAllAliases } from "./ontology";

export type AliasEntry = {
  phrase: string;
  category: string;
  subcategory: string;
  primaryNeed: string;
  suggestedConsultation: string;
};

let _compiledAliases: AliasEntry[] | null = null;

export function loadAliases(): AliasEntry[] {
  if (_compiledAliases) return _compiledAliases;
  const raw = getAllAliases();
  // getAllAliases already normalizes and sorts by length desc
  _compiledAliases = raw.map((r) => ({
    phrase: r.phrase,
    category: r.category,
    subcategory: r.subcategory,
    primaryNeed: r.primaryNeed,
    suggestedConsultation: r.suggestedConsultation,
  }));
  return _compiledAliases;
}

export function getCompiledAliases(): AliasEntry[] {
  return loadAliases();
}
