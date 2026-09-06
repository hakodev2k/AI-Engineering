# Versioning and Migration Rules

## Purpose
Evolve graph schemas and ontologies without uncontrolled consumer breakage or irreversible data loss.

## Scope
Ontology versions, schema migrations, property renames, relationship changes, data backfills, and cutovers.

## MUST
- Breaking semantic or structural changes MUST have an explicit compatibility boundary.
- Migrations MUST define source version, target version, affected data, validation, rollback, and consumer cutover.
- Backfills MUST be idempotent or safely restartable.
- Production migrations MUST be tested on representative data volume before execution.
- Irreversible migrations MUST require human approval.

## MUST NOT
- MUST NOT repurpose existing graph elements for unrelated semantics.
- MUST NOT drop old graph structures before active consumers are migrated or explicitly retired.
- MUST NOT combine unrelated breaking changes in one migration without clear justification.

## SHOULD
- Prefer expand-and-contract migration patterns for live systems.
- Keep migration provenance and timestamps auditable.

## Exceptions
Accelerated migration requires documented risk, owner, and rollback limitation.

## Verification
Inspect migration plans, dry-run results, consumer inventory, rollback evidence, and post-migration reconciliation.