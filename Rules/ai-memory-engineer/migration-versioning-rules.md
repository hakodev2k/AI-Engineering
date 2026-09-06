# Migration and Versioning Rules

## Purpose
Evolve memory schemas, embeddings, policies, and storage backends without corrupting or silently changing behavior.

## Scope
Schema migrations, index rebuilds, re-embedding, policy versions, dual-read/write, and cutover.

## MUST
- Breaking changes MUST introduce a versioned compatibility boundary or explicit migration plan.
- Migrations MUST define source state, target state, validation, rollback, and completion criteria.
- Re-embedding or reindexing MUST preserve authorization, provenance, deletion, and temporal semantics.
- Dual-read or dual-write periods MUST define conflict and precedence behavior.
- Large migrations MUST be capacity-assessed and progressively validated before full cutover.

## MUST NOT
- MUST NOT mutate production memory in place when failure would be irreversible without approved recovery.
- MUST NOT mix incompatible schema or embedding versions without explicit handling.
- MUST NOT declare migration success before sampled semantic validation and retrieval checks pass.

## SHOULD
- Prefer reversible, versioned migrations with staged traffic.
- Keep old versions available until rollback risk is acceptably low.

## Exceptions
Exceptions require urgency, blast-radius controls, evidence, and approval.

## Verification
Inspect migration plans, dry runs, compatibility tests, sampled reconciliations, cutover metrics, and rollback evidence.