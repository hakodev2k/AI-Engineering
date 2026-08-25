# State Management

## Purpose
Operate Terraform state safely as the authoritative mapping between configuration and real infrastructure.

## When to use
Use when designing backends, moving resources, recovering state, importing infrastructure, or diagnosing drift.

## Inputs
Backend configuration, current state, configuration, target resources, locks, backups, access controls.

## Context to inspect
Backend type, encryption, locking, state lineage/serial, workspace or stack boundaries, remote-state consumers, recent applies.

## Core knowledge
State can contain sensitive data and resource identity. Treat state operations as production changes. Preserve lineage, stable addresses, locking, encryption, least privilege, and recoverable backups.

## Procedure
1. Back up state before surgery.
2. Confirm backend, workspace, credentials, and lock status.
3. Compare configuration, state addresses, and provider reality.
4. Prefer moved blocks for refactors; use import for unmanaged existing resources.
5. Use state mv/rm only with an explicit address mapping and recovery plan.
6. Reinitialize when backend metadata changes.
7. Run refresh-aware plan and inspect every delta.
8. Record the operation and remove temporary migration constructs only when safe.

## Decision points
Split state for independent ownership/blast radius; keep together resources requiring atomic coordination. Prefer declarative import/moved blocks when supported because changes remain reviewable.

## Common failure patterns
Manual state editing, wrong workspace, stale locks broken without investigation, plaintext/local state, broad state access, and removing state before proving ownership.

## Verification
Confirm backend lock/encryption, state addresses, plan convergence, and actual resource identity. A successful command alone is not verification.

## Expected output
Consistent recoverable state with no unintended create/destroy operations.

## Stop conditions
Stop on uncertain backend identity, unexplained lineage mismatch, missing backup, active legitimate lock, or destructive plan.