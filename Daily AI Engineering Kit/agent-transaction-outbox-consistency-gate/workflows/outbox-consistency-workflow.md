# Workflow: Transaction Outbox Consistency Gate

## Trigger
A feature/refactor changes business persistence or event publishing, a dispatcher/consumer changes, or an incident reports missing/duplicate integration events.

## Entry conditions
Repository is accessible; target behavior is stated; production mutation is not required.

## Inputs
Acceptance criteria, repository root, affected service, event type/consumer when known, build/test commands.

## Context
Transaction code, outbox model/table, dispatcher, broker adapter, consumer, tests, retry configuration, logs/metrics if incident-driven.

## Stages
1. **Preflight — Repository Explorer**: confirm clean/readable repository context and locate affected modules.
2. **Evidence collection — Repository Explorer**: run scanner and trace mutation → transaction → outbox → claim → publish → acknowledgement → processed/retry → consumer.
3. **Plan — Implementation Agent**: classify facts/hypotheses; propose smallest changes and tests. Stop for any approval-required action.
4. **Execute — Implementation Agent**: edit only affected paths; preserve stable message id and public/event contracts unless approved otherwise.
5. **Test — Implementation Agent**: build/format plus focused tests. Required scenarios: rollback prevents both business/outbox commit; failure after commit before successful publish remains recoverable; duplicate delivery is safe; retry reaches bounded terminal behavior.
6. **Review — Verification Agent**: inspect diff for publish-before-commit, premature processed marking, unstable ids, unbounded retries, unsafe row claiming, and unrelated changes.
7. **Verify — Verification Agent**: rerun relevant tests and scripts; set four verification booleans from evidence only.
8. **Complete**: status becomes `verified` only when all checks pass.

## Produced artifacts
`outbox-evidence.json`, code/test diff in the host repository, and verification result.

## Checkpoints
- CP1: atomic transaction evidence exists.
- CP2: publisher acknowledgement/processed ordering proven.
- CP3: duplicate delivery behavior proven.
- CP4: retry/quarantine behavior bounded.

## Retry rules
Maximum 2 retries for transient test runner, broker emulator, filesystem, or tooling failures. Preserve failing command/output before retry. Reproducible code/test failures are not transient and require a change or escalation.

## Approval points
Database schema change, destructive SQL, production deployment/configuration, secret change, breaking event contract, or security weakening. Stop before action until explicit approval exists.

## Failure paths
- Missing permission/context → `blocked`, record exact missing evidence.
- Validation/build/test failure → `failed`, preserve command/output; implementation may iterate, then verification reruns.
- Two repeated transient failures → `blocked` and escalate.
- Business-rule ambiguity affecting event semantics → `blocked` for human decision.

## Stop conditions
Any unresolved critical/high finding, missing approval, inability to prove a verification dimension, or retry limit reached.

## Definition of Done
Required context gathered; business/outbox atomicity proven; publisher ordering safe; stable message identity proven; duplicate consumer behavior proven; retry terminal state bounded; relevant build/tests pass; evidence validates; no unintended change or blocking risk remains; required approvals exist.
