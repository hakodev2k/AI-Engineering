# Deadlock Reproduction and Fix Workflow

## Trigger
A database reports a deadlock victim/cycle or application telemetry contains credible deadlock evidence.

## Entry conditions
Repository revision is known; non-production reproduction environment exists; diagnostics can be sanitized and retained.

## Inputs
Incident evidence, database engine/version, repository, acceptance criteria, permitted change scope.

## Stages
1. **Preflight — Investigator:** validate environment and preserve original evidence.
2. **Trace — Investigator:** map victim and competing statements to transaction boundaries and resource order.
3. **Reproduce — Investigator:** build/run deterministic coordination harness. Maximum 3 attempts. Preserve every result.
4. **Checkpoint:** proceed only with `reproduction_before=true`; otherwise status `blocked`.
5. **Plan — Implementer:** select one minimal cycle-breaking hypothesis. Schema/index/config/isolation changes require human approval before execution.
6. **Execute — Implementer:** apply change and run build/unit/integration checks.
7. **Retest — Implementer:** run post-fix harness. Maximum 2 fix attempts total; revert failed hypothesis before another.
8. **Independent verification — Verifier:** validate evidence, inspect diff, rerun tests and post-fix reproduction three times.
9. **Final gate:** run `python scripts/validate-evidence.py <evidence.json>` and require status `verified`.

## Artifacts
Evidence JSON matching `schemas/evidence.schema.json`, reproduction harness in the host repository, test/build logs, implementation diff.

## Retry rules
Transient test-environment startup/tool failures may be retried within the stage limits. Logic failures and reproduced deadlocks are evidence, not transient failures. Permission failures are not retried with broader permissions.

## Approval points
Production actions, destructive SQL, schema/index changes, isolation-level changes, production configuration, secret/permission changes, or breaking API changes stop before execution pending explicit human approval.

## Failure paths
- Cannot identify both transactions: `blocked` with missing evidence.
- Cannot reproduce in 3 attempts: `blocked` with attempts preserved.
- Two fix hypotheses fail: `blocked` with both diffs/results preserved.
- Verification differs from implementer result: `blocked`; verifier evidence wins until reconciled.

## Definition of Done
Original cycle is evidenced; pre-fix reproduction succeeds; smallest safe fix is applied; relevant tests pass; post-fix reproduction fails to recreate the deadlock in three verifier runs; business invariants hold; evidence validates; approvals exist where required; no blocking risk remains.
