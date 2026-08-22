# Rules — Sandbox Skill Catalog Coherence

1. Every planning run **MUST** bind to exactly one skill-materialization generation.
2. Every advertised skill **MUST** have a sandbox-readable `SKILL.md` path in that generation.
3. Every expected eligible skill **MUST** appear in the advertised catalog unless an explicit trusted policy excludes it.
4. Catalog generation and materialization generation **MUST** match; cross-generation mixing is forbidden.
5. Shared mutable skill directories **MUST NOT** be destructively refreshed while readers can observe them as the live generation.
6. Publication **SHOULD** use atomic rename/swap, an immutable run-scoped directory, or an equivalent mechanism that prevents partial observation.
7. A run **MUST NOT** begin skill-dependent planning when completeness/readability verification fails.
8. A missing skill **MUST NOT** be silently treated as if the capability never existed.
9. A read failure **MUST NOT** trigger unbounded model/tool retries.
10. Rebuild attempts **MUST** be bounded by `config/policy.json`.
11. Sandboxing, path validation, or other security boundaries **MUST NOT** be weakened to repair catalog coherence.
12. Identical eligibility inputs under concurrent runs **SHOULD** produce the same catalog hash.
13. The verifier **MUST** report Facts, Assumptions, Evidence, Decision, Risks, and Verification status without requesting hidden chain-of-thought.
14. Completion **MUST** distinguish `Implemented`, `Measured`, and `Verified` evidence.
