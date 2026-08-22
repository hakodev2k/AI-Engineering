# Reconcile Configuration Drift Workflow

## Trigger
Run before a release, after a configuration-related incident/change, or when environment behavior differs unexpectedly.

## Entry conditions
- Read-only snapshots for at least two environments are available.
- `config/drift-policy.json` is valid.
- An inventory compatible with `examples/inventory.json` identifies the sources.

## Inputs
Inventory, policy, repository context, optional deployment/audit history, and acceptance criteria for intended environment behavior.

## Context
Load only affected configuration bindings, deployment definitions, nearby tests, and authoritative change records.

## Stages

### 1. Preflight
Responsible: workflow owner.
Tools: `scripts/verify-package.py`, inventory validation.
Artifact: preflight status.
Checkpoint: package and inputs valid; otherwise stop.

### 2. Detect
Responsible: config-drift-investigator.
Tools: `scripts/scan-config-drift.py`.
Artifact: `drift-report.json` conforming to `schemas/drift-report.schema.json`.
Checkpoint: deterministic scan completed without exposing raw secret values.

### 3. Investigate
Responsible: config-drift-investigator.
For each material finding, trace code/config ownership and change evidence; label disposition as `accept`, `reconcile`, or `investigate`.
Checkpoint: every high-risk finding has evidence and disposition.

### 4. Plan
Responsible: config-drift-investigator.
Produce the smallest source-of-truth change, affected environments, tests/probes, rollback approach, and approval needs.
Checkpoint: no unexplained production mutation is included.

### 5. Approval
Responsible: human.
Required before production configuration changes; secret/auth/TLS/database/security-control changes; schema/infrastructure changes; irreversible actions.
Failure path: if approval is denied or absent, status becomes blocked and execution stops.

### 6. Execute
Responsible: authorized implementation agent or human operator.
Use repository/source-of-truth changes where possible. Never bypass environment protections.
Artifact: change diff/audit receipt.
Checkpoint: implementation matches the approved scope.

### 7. Verify
Responsible: config-drift-verifier, independent from implementation.
Rerun scanner using fresh snapshots, run relevant tests/build/probes, and inspect the change diff.
Artifact: verification status and evidence.

### 8. Complete
Responsible: workflow owner.
Complete only when intended drift is removed or explicitly accepted, verification succeeds, approvals are recorded, and residual risks are documented.

## Retry rules
- Transient tool/read failure: maximum 2 retries.
- Reconciliation verification failure: maximum `max_reconcile_attempts` from policy (default 2).
- Preserve failed command output, prior reports, and changed-file evidence before retrying.
- Permission/approval failures are not retryable without new authorization.

## Stop conditions
Stop on missing authoritative evidence, approval boundary, permission failure, invalid input, security uncertainty, or exhausted retries.

## Failure paths
- Invalid snapshot/inventory: correct the input and rerun detection.
- Missing environment: mark blocked; do not infer its state.
- Test/build failure: preserve evidence, investigate once per bounded retry policy, then escalate.
- Unexpected new drift after change: stop and revert via normal approved repository/deployment mechanism if safe; do not patch production ad hoc.

## Definition of Done
- Preflight passed.
- Fresh deterministic scan exists.
- All high-risk findings have evidence and disposition.
- Required human approvals were obtained before protected actions.
- Approved changes were limited to intended scope.
- Post-change rescan and relevant tests/probes passed.
- No unexplained blocking drift remains.
- Residual accepted differences and risks are documented.
