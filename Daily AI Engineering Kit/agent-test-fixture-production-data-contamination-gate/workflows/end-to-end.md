# End-to-End Workflow

## Trigger
Fixture/snapshot/seed/mock/cassette creation or modification, especially when derived from incident or production evidence.

## Entry conditions
Repository is available; no dangerous action is pre-authorized implicitly; config exists.

## Inputs
Repository root, task description, optional changed files, repository test/build commands.

## Stages

### 1. Preflight — Repository Explorer
Run config validation. Confirm repository path. Collect fixture roots and relevant tests. Output inventory and provenance candidates.

**Checkpoint:** invalid config blocks execution.

### 2. Scan — Repository Explorer
Run `scan-fixtures.py`. Separate blocking from review findings. Record facts/hypotheses/evidence.

**Checkpoint:** suspected credentials are never validated against live systems.

### 3. Plan — Implementation Agent
For each confirmed or unresolved blocking finding, define the minimum synthetic replacement and required test shape. Avoid unrelated refactors.

**Approval point:** stop before requesting production access, changing production config, secrets, schema, API contract, security policy, destructive data, infrastructure, or Git history.

### 4. Execute — Implementation Agent
Apply replacements and focused tests. No allowlist weakening to bypass findings.

### 5. Deterministic verification — Implementation Agent
Run focused tests, scanner, config validator, and applicable formatting/build checks. Produce evidence JSON.

### 6. Independent verification — Verification Agent
Inspect diff and consuming tests; rerun scanner; validate evidence schema; confirm provenance and synthetic replacements.

## Retry rules
Maximum implementation retries: **2**. Retryable: deterministic test failure caused by remediation, scanner false-positive resolvable through narrow config evidence, formatting/build error introduced by the change. Preserve scan/test output from each attempt. Non-retryable: permission failure, need for production access, suspected live secret, approval-required action, unresolved provenance after evidence review. Escalate and stop.

## Failure paths
- Validation failure → stop.
- Tool transient failure → retry tool once.
- Test/build failure → bounded implementation retry.
- Permission/environment failure → preserve evidence and stop; no privilege escalation.
- Business-rule mismatch → stop and surface unresolved requirement.
- Suspected secret → remove from tracked work if possible, flag rotation requirement, do not validate.

## Produced artifacts
Scan JSON, evidence JSON, test/build outputs, provenance decisions, and code/fixture diff.

## Definition of Done
All affected fixtures have provenance; no unresolved blocking findings; behavior remains covered by synthetic tests; evidence validates; independent verification is `verified`; no pending approval-required action remains.