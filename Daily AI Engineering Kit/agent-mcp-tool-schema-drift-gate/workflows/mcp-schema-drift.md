# Workflow: MCP Schema Drift
## Trigger
MCP contract definitions or MCP dependencies changed.
## Stages
1. Pre-change baseline capture.
2. Contract Explorer runs deterministic diff and maps consumers.
3. Migration Planner defines compatibility strategy.
4. Human approval checkpoint for intentional break.
5. Implementation owner performs smallest safe change.
6. Host build/tests.
7. Fresh candidate capture.
8. Deterministic gate rerun.
9. Independent Verification Agent review.
10. Complete only when Definition of Done passes.
## Retry rules
Transient capture/tool failure: max 2. Build/compatibility failure: max 2 implementation cycles. Permission/approval failure: no automatic retry.
## Stop conditions
Unapproved break, invalid snapshots, exceeded retries, missing evidence, security regression, unknown consumer impact.
## Definition of Done
No unapproved breaking drift; known consumers migrated; tests/build pass; report preserved; independent status verified; no blocking action remains.
