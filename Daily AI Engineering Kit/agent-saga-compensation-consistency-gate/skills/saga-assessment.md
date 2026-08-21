# Skill: Saga Assessment

## Purpose
Map a distributed multi-step operation and determine whether failure can leave cross-system state inconsistent.

## When to use
Use for workflows spanning multiple databases, queues, APIs, payment/inventory/order systems, or background jobs where one transaction cannot cover every side effect.

## Inputs
- Entry point or use case
- Relevant handlers/services
- Persistence and external integrations
- Existing retry/idempotency behavior
- Tests, logs, receipts, or incident evidence

## Preconditions
Repository is readable and the target business flow is identifiable.

## Allowed tools
Repository search/read, tests, logs, local scripts, API documentation, read-only database evidence.

## Constraints
Do not modify production state. Do not infer business reversibility without evidence.

## Process
1. Locate the trigger and trace the full execution path.
2. List each step in actual commit order.
3. For each step record system, side effect, atomic boundary, retry behavior, idempotency mechanism, durable receipt, and observable outcome.
4. Mark failure boundaries between steps.
5. Identify steps whose outcome can become unknown after timeout/crash.
6. Locate existing compensation/reconciliation logic.
7. Classify each step as compensable, non-compensable, or reconciliation-required.
8. Identify ordering constraints between compensations.
9. Capture evidence paths and unresolved questions.
10. Run `python scripts/saga_gate.py --input <plan.json> --policy config/policy.yaml` against the resulting plan.

## Expected output
A structured saga plan compatible with `examples/saga-plan.json`, plus evidence-backed findings.

## Verification
Every side-effecting step appears once and its compensation/idempotency status is evidenced.

## Failure handling
If external outcome cannot be determined, classify it as unknown and require reconciliation; do not assume rollback.

## Stop conditions
Stop when the flow cannot be traced, required permissions are missing, or a destructive action would be required to gather evidence.
