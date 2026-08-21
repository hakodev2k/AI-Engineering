# Workflow: Audit and Execute

## Trigger
A tool call is about to run unattended, has been denied, or has conflicting permission signals.

## Goal
Produce a deterministic effective permission decision without weakening security.

## Inputs
Tool call, policy layers, operation risk, approval state, prior denial evidence.

## Baseline
Capture configured allow/deny rules and the actual runtime decision for one representative call when safe to do so.

## Context
Trust boundary, parent/subagent inheritance, classifier status, hook result, server requirements.

## Stages
1. **Observe** — collect configuration and runtime decision evidence.
2. **Normalize** — convert every layer to the schema accepted by `permission_audit.py`.
3. **Diagnose** — identify allow/deny conflicts and the layer that actually wins.
4. **Hypothesis** — state why configured policy differs from effective policy.
5. **Preflight** — run the deterministic auditor.
6. **Decision checkpoint** — Permission Reviewer independently validates risky calls.
7. **Execute or stop** — execute only if effective decision is allow and required approval exists.
8. **Verify** — confirm the observed runtime result matches the preflight model; update evidence if not.

## Responsible agent
Execution agent collects inputs; Permission Reviewer owns independent review for risky changes.

## Tools
Read-only config/log inspection, `scripts/permission_audit.py`, existing approval system.

## Outputs
Decision JSON, conflict evidence, retry classification, remediation, verification record.

## Checkpoints
Before any mutation; after a denial; after policy configuration changes.

## Metrics
Conflict count, deterministic-denial retries, global bypasses, calls with provenance, preflight/runtime agreement rate.

## Retry policy
Transient classifier/service failures: at most 2 retries with backoff. Deterministic policy denial: at most 1 retry and only after material policy/approval change.

## Stop conditions
Authoritative deny, unknown precedence on risky action, missing approval, or two transient failures.

## Failure path
Preserve evidence; do not broaden permissions; escalate to operator/security owner.

## Verification
Runtime decision MUST match modeled decision in test fixtures and sampled production-safe calls.

## Definition of Done
Policy layers documented, conflicts identified, effective decision explainable, no unrelated boundary weakened, and verification evidence recorded.