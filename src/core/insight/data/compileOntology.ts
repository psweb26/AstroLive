import { loadOntology } from "../ontology";

// Compile the ontology into an immutable in-memory structure.
export function compileOntology() {
  const raw = loadOntology();
  // For Sprint 1 we don't transform; just freeze to guarantee immutability.
  return Object.freeze(raw.map((r) => Object.freeze(r)));
}
