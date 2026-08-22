# Evidence Inventory Rules

## Rules
- Scope-sensitive tasks **MUST** establish authoritative repository roots and required evidence classes before mutation.
- Tasks containing `all`, `every`, repository-wide migration, release readiness, or equivalent exhaustive language **MUST** establish an inventory denominator before reporting progress percentages or completion.
- Loaded conversation/checkpoint prose **MUST NOT** be treated as authoritative repository state unless reconciled against current durable artifacts.
- A checkpoint assertion **MUST** retain provenance and freshness status: `claimed`, `observed`, `persisted`, or `verified`.
- Missing evidence **MUST** be reported as unresolved; it **MUST NOT** be silently interpreted as absent.
- Search coverage **MUST** include every declared root and evidence pattern unless an exclusion is explicit and justified.
- Implementation **MUST NOT** begin when an unresolved evidence class can materially change scope, safety, or acceptance criteria.
- After implementation, the inventory **MUST** be re-run when repository state changed or when completion depends on exhaustive source coverage.
- A completion claim **MUST** fail if newly discovered in-scope sources were not included in the baseline unless they were created by the implementation and are explicitly classified as outputs.
- Human or subagent verification **SHOULD** use the durable inventory manifest, not the implementer's prose summary.
- Investigation loops **MUST** be bounded: at most two search expansions after the initial declared-root inventory unless a human explicitly broadens scope.
- The agent **MUST NOT** expose hidden chain-of-thought. Store only observable facts, assumptions, evidence references, hypotheses, decisions, risks, and verification status.

## Enforcement
Use `../scripts/check_inventory.py` before mutation and during final verification. A non-zero result blocks execution/completion according to the workflow.