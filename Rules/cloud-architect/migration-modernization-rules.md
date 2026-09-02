# Migration and Modernization Rules

## Purpose
Move workloads to or within cloud environments without uncontrolled business interruption, data loss, compatibility failure, or permanent unnecessary complexity.

## Scope
Applies to rehost, replatform, refactor, service replacement, data migration, region migration, and cloud-to-cloud transitions.

## MUST
- Migrations MUST define source state, target state, dependencies, compatibility constraints, data movement, cutover method, rollback or recovery path, and acceptance criteria.
- Migration sequencing MUST account for shared dependencies and prevent incompatible intermediate states.
- Data migrations MUST validate completeness, integrity, reconciliation, and recovery before authoritative cutover.
- High-risk cutovers MUST have approved go/no-go criteria, monitoring, responsible operators, and rollback decision thresholds.
- Modernization scope MUST be justified by measurable benefits rather than bundled automatically into migration work.

## MUST NOT
- MUST NOT perform irreversible migration steps without an approved recovery strategy.
- MUST NOT assume successful infrastructure deployment proves application or data migration success.
- MUST NOT remove the previous recovery path before target stability is demonstrated for the agreed validation period.

## SHOULD
- Prefer incremental migration patterns when they reduce blast radius and enable evidence-based validation.
- Separate mandatory migration work from optional modernization where doing so improves reversibility.

## Exceptions
Exceptions require documented constraints, business risk, recovery limitations, validation evidence, and approval.

## Verification
Review migration plans, dependency maps, rehearsal results, reconciliation reports, cutover checklists, rollback tests, telemetry, and post-migration acceptance evidence.