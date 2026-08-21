# Delivery Safety Gate Workflow

## Trigger
A repository introduces or changes asynchronous message publishing/consumption, a delivery incident occurs, or retry/idempotency behavior is questioned.

## Entry conditions
- Repository can be inspected.
- Relevant service boundaries and test commands can be discovered.
- Production operations are not required to begin.

## Inputs
Task scope, repository, current architecture, policy config, failures/logs if available.

## Context
Business transaction code, outbox/inbox persistence, dispatcher/consumer code, message contracts, broker/API adapters, migrations, tests, logging/metrics.

## Stages
1. **Explore** — Repository Explorer maps entry points, transactions, identities, side effects, retries, and tests.
2. **Plan** — Delivery Planner proposes the smallest safe change set and marks approval boundaries.
3. **Implement** — Implementation Agent performs approved local edits and adds failure-mode tests.
4. **Deterministic gate** — run `python scripts/outbox_inbox_gate.py --input <snapshot.json> --policy config/policy.yaml --output <result.json>`.
5. **Build/test** — run repository-native build and focused tests; retry transient infrastructure failures at most twice.
6. **Independent verify** — Verification Agent inspects diff and evidence without editing.
7. **Complete or block** — emit verified status only if all Definition of Done checks pass.

## Produced artifacts
- Repository evidence map.
- Change plan.
- Code/test diff.
- Gate result JSON.
- Build/test logs.
- Verification report.

## Checkpoints
- After Explore: transaction and message identity must be known.
- After Plan: risky actions must be labeled approval-required.
- After Implement: no unplanned files may be modified without re-planning.
- Before Complete: deterministic gate, tests, and independent review must pass.

## Retry rules
- Tool/network/transient test failures: maximum 2 retries; preserve original and retry evidence.
- Publish/consumer business failures in tests: no blind retry; fix or block.
- Deterministic validation failure: no retry unless input/code/config changes.

## Approval points
Explicit human approval is required before production replay, destructive repair, schema migration, data deletion, production config changes, breaking message contracts, infrastructure changes, or weakened security controls.

## Failure paths
- Unknown transaction boundary → stop and request evidence in the report.
- External side effect has no idempotency/reconciliation → block verification.
- Retry budget exhausted → preserve evidence and stop.
- Permission/environment failure → report as environment blocker; never raise privileges silently.

## Stop conditions
Stop on approval boundary, repeated transient failure beyond budget, unverifiable event identity, or unresolved duplicate business effects.

## Definition of Done
- State change and outbox enqueue are proven atomic where required.
- Dispatcher failure/crash is recoverable and retries are bounded.
- Consumer duplicate detection is atomic and durable.
- Repeated delivery yields one committed business effect.
- Tests cover rollback, duplicate delivery, concurrency, and crash windows relevant to the implementation.
- Deterministic gate passes.
- Independent verifier confirms diff scope and evidence.
- Remaining risks are documented and no blocking failure remains.
