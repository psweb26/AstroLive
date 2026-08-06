import { RULES, RuleDef } from "../rules";

type CompiledRule = RuleDef & {
  patternTokens: ReadonlyArray<string>;
  tokenLength: number;
};

export function buildRuleIndex() {
  const phraseMap = new Map<string, CompiledRule[]>();
  const tokenMap = new Map<string, CompiledRule[]>();
  const styleMap = new Map<string, CompiledRule[]>();

  for (const r of RULES) {
    const pattern = r.pattern || '';
    const tokens = pattern.length > 0 ? pattern.split(' ').filter(Boolean) : [];
    const cr: CompiledRule = Object.freeze({ ...r, patternTokens: Object.freeze(tokens), tokenLength: tokens.length });

    if (r.type === 'phrase') {
      const key = pattern;
      const arr = phraseMap.get(key) || [];
      arr.push(cr);
      phraseMap.set(key, arr);
    } else if (r.type === 'token') {
      const key = pattern;
      const arr = tokenMap.get(key) || [];
      arr.push(cr);
      tokenMap.set(key, arr);
    } else if (r.type === 'style') {
      const key = pattern;
      const arr = styleMap.get(key) || [];
      arr.push(cr);
      styleMap.set(key, arr);
    }
  }

  // Freeze arrays inside maps and return read-only maps
  const freezeMap = (m: Map<string, CompiledRule[]>) => {
    const out = new Map<string, ReadonlyArray<CompiledRule>>();
    for (const [k, arr] of m) {
      out.set(k, Object.freeze(arr.map((x) => Object.freeze(x))));
    }
    return Object.freeze(out) as ReadonlyMap<string, ReadonlyArray<CompiledRule>>;
  };

  return {
    phraseMap: freezeMap(phraseMap),
    tokenMap: freezeMap(tokenMap),
    styleMap: freezeMap(styleMap),
  } as const;
}
