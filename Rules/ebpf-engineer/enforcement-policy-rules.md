# Enforcement Policy

## Purpose
Ensure eBPF-based security or traffic enforcement is correct, reviewable, and safely reversible.

## Scope
LSM, cgroup, networking, syscall-related enforcement, policy maps, decisions, defaults, and bypass mechanisms.

## MUST
- Enforcement semantics MUST be specified independently of implementation.
- Default allow/deny behavior MUST be explicit for startup, loader failure, stale policy, and control-plane loss.
- Policy updates MUST be authenticated, authorized, validated, and auditable.
- Decisions MUST expose bounded reason telemetry sufficient to diagnose denials.
- Changes capable of denying production traffic or execution MUST require human approval or a pre-approved automated policy.

## MUST NOT
- MUST NOT silently broaden privilege when policy evaluation fails.
- MUST NOT silently deny critical workloads due to telemetry/control-plane failure unless fail-closed behavior is explicitly required.
- MUST NOT create undocumented bypasses.

## SHOULD
- Support dry-run/audit mode before enforcement where risk warrants it.
- Keep emergency bypass narrowly scoped and audited.

## Exceptions
Emergency policy changes require authorized incident procedure, bounded duration, monitoring, and retrospective review.

## Verification
Test allow/deny matrices, failure modes, stale policy, unauthorized updates, audit records, rollback, and dry-run parity.