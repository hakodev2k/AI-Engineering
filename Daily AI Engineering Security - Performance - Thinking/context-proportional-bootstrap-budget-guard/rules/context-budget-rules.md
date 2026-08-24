# Context Budget Rules

- The runtime **MUST** identify the active model context window before claiming bootstrap-budget enforcement.
- The bootstrap payload **MUST** be measured before optimization and after every accepted change.
- Security, authorization, explicit task constraints, and output contracts **MUST NOT** be evicted solely to reduce tokens.
- The runtime **MUST** reserve both task/tool-result capacity and output capacity before loading optional tools, skills, memory, or examples.
- Optional components **MUST** have observable token counts and a deterministic priority before eviction.
- Duplicate static context **MUST** be removed or referenced once when semantics are unchanged.
- Tool/skill catalogs **SHOULD** be loaded on demand when they are not required for the first decision.
- A configuration **MUST NOT** be called improved until a representative quality check is compared with baseline.
- Optimization loops **MUST** stop after the configured maximum iterations.
- Unknown token counts **SHOULD** be conservatively estimated and labeled; they **MUST NOT** be represented as exact measurements.