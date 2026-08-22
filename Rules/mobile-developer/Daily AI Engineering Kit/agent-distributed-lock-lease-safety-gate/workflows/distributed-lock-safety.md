# Distributed Lock Lease Safety Workflow

## Trigger
A new/changed distributed lock, intermittent duplicate execution, concurrent singleton job, stale writer, unexplained overlap, or lock-related production incident.

## Entry conditions
Repository is readable; protected operation is identifiable; test/local environment is available or limitations are recorded.

## Inputs
Task/incident description, repository, lock backend/client, lease configuration, protected resource, tests/logs.

## Flow
`Trigger → Context → Investigate → Reproduce → Plan → Implement → Test → Independent Verify → Approval if needed → Complete`

### 1. Context — Lock Investigator
Map acquire/renew/release and critical-section entry points. Run scanner. Artifact: investigation evidence.

### 2. Reproduce — Lock Investigator
Test contender race, holder expiry, then stale holder resume. Do not use production. Checkpoint: root cause evidenced or workflow becomes `blocked`.

### 3. Plan — Implementation Agent
Choose smallest fix: owner token, atomic conditional release, bounded renewal/retry, fencing, or critical-section reduction. Approval checkpoint if backend/schema/production behavior changes.

### 4. Implement — Implementation Agent
Add regression test first where practical, then minimal fix. Maximum test-fix retries: 2. Preserve each failing output.

### 5. Verify — Independent Verification Agent
Run scanner, relevant project build/tests, contention, expiry and stale-owner tests; validate evidence with `python scripts/verify-evidence.py <report.json>`.

## Retry rules
Acquisition/tool transient failures: max 2 retries with backoff. Implementation test-fix: max 2. Validation failures are not blindly retried; change hypothesis or stop. Permission failures stop without privilege escalation.

## Failure paths
- Unknown backend semantics → `blocked`, document missing evidence.
- Reproduction disproves hypothesis → return to investigation once; do not implement speculative fix.
- Tests still fail after 2 fixes → `fail`, preserve evidence and escalate.
- Approval denied/missing → stop before risky action.

## Approval points
Production rollout/config changes, lock backend replacement, destructive lock cleanup, schema/infrastructure changes, security weakening, irreversible migration.

## Definition of Done
Root cause/context documented; minimal artifacts exist; build/relevant tests pass; contention/expiry/stale-owner verification all pass; evidence contract validates; approvals are present where required; residual risks documented; no blocking failure remains.
