import { getCompiledAliases } from "../aliases";

// Compile aliases into an immutable structure used by the engine.
export function compileAliases() {
  const raw = getCompiledAliases();
  // transform into a map for fast lookup: phrase -> alias entry
  const map: Record<string, typeof raw[0]> = {};
  raw.forEach((r) => {
    map[r.phrase] = r;
  });
  return Object.freeze(map);
}
