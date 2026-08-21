# Message Ordering Consistency Gate Workflow

## Trigger
A code/config change affects event publication, consumption, partition/session keys, concurrency, retries, replay, deduplication, versioning, or broker ordering semantics.

## Entry conditions
Repository is readable; target flow is identifiable; no production-only action is executed without approval.

## Inputs
Changed files/module, message contracts, broker settings if available, tests, incidents/logs, acceptance criteria.

## Context
Publisher → transport → partition/session key → consumer → persistence → downstream side effects → retry/dead-letter/replay.

## Stages
1. **Context** — Ordering Investigator maps the full flow and ordering domain.
2. **Static risk scan** — run `python3 scripts/scan-ordering-risk.py <target>`.
3. **Assessment** — create/update an assessment conforming to `schemas/ordering-assessment.schema.json`.
4. **Plan** — identify smallest safe change and required tests.
5. **Approval checkpoint** — stop before any action listed in `config/message-ordering.yaml` approval boundaries.
6. **Execute** — implementation owner applies the smallest safe change.
7. **Test** — exercise out-of-order, duplicate replay, stale event, and parallel-consumer scenarios.
8. **Independent verify** — Ordering Verifier reruns scanner/tests/build and validates the assessment with `python3 scripts/validate-assessment.py <assessment.json>`.
9. **Complete** — only when status can be `pass` and no blocking risk remains.

## Produced artifacts
- Scanner output
- Ordering assessment JSON
- Build/test output
- Diff review notes

## Checkpoints
- Ordering key is stable and explicit.
- Monotonic sequence/version semantics are defined.
- Duplicate/replay handling is idempotent.
- Parallelism cannot reorder state unsafely.
- Required tests exist and pass.

## Retry rules
Maximum 2 fix-retest attempts. Retryable: implementation/test defects with actionable evidence. Preserve scanner output, failing test logs, assessment, and diff between attempts. Transient tool failures may be retried at most twice without consuming the fix-retest budget. On exhaustion, set status `blocked` or `fail` and escalate.

## Stop conditions
Unknown ordering domain, ambiguous sequence semantics, missing required evidence after bounded attempts, approval-required change, permission failure, or exhausted retry budget.

## Approval points
Production broker reconfiguration, partition-count change, retention change, destructive purge, breaking event contract, disabling duplicate detection, or weakening ordering guarantees.

## Failure paths
- Validation failure → correct assessment only if evidence supports it.
- Test/build failure → bounded fix-retest loop.
- Tool/environment failure → preserve error and retry twice; then escalate.
- Permission/approval failure → stop without increasing privileges.

## Definition of Done
Assessment validates; all four verification scenarios pass; scanner high-risk findings are resolved or explicitly accepted through required approval; build/relevant tests pass; diff contains no unintended ordering/config/contract change; unresolved risks are documented.
