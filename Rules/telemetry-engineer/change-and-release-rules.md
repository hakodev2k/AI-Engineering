# Change and Release Rules

## Purpose
Make telemetry changes reviewable, reversible, and safe for dependent operational systems.

## Scope
Instrumentation releases, collector changes, schema changes, routing, sampling, retention, and backend configuration.

## MUST
- Production telemetry changes MUST identify affected producers, consumers, contracts, and rollback method.
- High-risk changes MUST use staged rollout or equivalent blast-radius control when practical.
- Release verification MUST include signal correctness, pipeline health, and downstream consumer behavior.
- Production configuration changes with material operational impact MUST require appropriate human approval.

## MUST NOT
- MUST NOT combine unrelated high-risk telemetry changes when doing so obscures diagnosis.
- MUST NOT remove critical fields, routes, or signals without verified consumer migration.
- MUST NOT force push or rewrite change history to bypass review.

## SHOULD
- Prefer small, backward-compatible, independently reversible changes.

## Exceptions
Emergency changes require incident context, minimized scope, explicit authority, audit trail, and post-change review.

## Verification
Inspect pull requests, diffs, approvals, rollout records, consumer checks, and rollback evidence.