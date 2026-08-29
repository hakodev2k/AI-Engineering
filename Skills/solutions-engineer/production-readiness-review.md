# Production Readiness Review

## Purpose
Determine whether an evaluated solution is ready for production operation, beyond functional proof.

## When to use
Use before pilot expansion, production cutover, or technical sign-off.

## Inputs
Architecture, test evidence, security review, runbooks, SLOs, deployment process, recovery plan, support model.

## Context to inspect
Capacity, reliability, observability, access, secrets, backups, rollback, upgrades, dependency ownership, and incident response.

## Core knowledge
Functional success is not production readiness. Senior review asks whether the system can fail safely, be diagnosed, restored, changed, and supported under realistic operating conditions.

## Procedure
1. Confirm functional acceptance evidence.
2. Review security and identity controls.
3. Validate capacity and reliability assumptions.
4. Inspect telemetry and alerting.
5. Verify backup, recovery, and rollback.
6. Review deployment and upgrade procedures.
7. Confirm support ownership and escalation.
8. Record blockers, accepted risks, and launch conditions.

## Decision points
Block launch for risks that can cause unacceptable security, data, or availability impact. Allow documented follow-ups only when residual risk is explicitly accepted.

## Common failure patterns
Treating POC success as launch approval, untested recovery, no on-call ownership, manual undocumented deployment, and unresolved security findings.

## Verification
Critical operational scenarios are tested and launch criteria have accountable sign-off.

## Expected output
A production-readiness decision with blockers and residual risks.

## Stop conditions
Stop and escalate when mandatory controls, recovery evidence, or ownership is missing.