# Separation of Duties

## Purpose
Identify and enforce toxic combinations of access so one identity cannot complete incompatible high-risk actions without independent control.

## When to use
Use for finance, administration, deployment, security, procurement, or other workflows with fraud or abuse risk.

## Inputs
Business processes, entitlements, roles, transaction capabilities, risk owners, compensating controls.

## Context to inspect
Role catalog, direct grants, nested groups, privileged access, workflows, emergency access, audit findings.

## Core knowledge
Separation of duties must model business capabilities, not just group names. Preventive controls are strongest; detective controls may be acceptable when prevention is operationally impractical.

## Procedure
1. Map critical business actions and stages.
2. Identify incompatible capabilities.
3. Translate capabilities into actual entitlements.
4. Define preventive conflict rules.
5. Detect conflicts across direct and inherited access.
6. Establish approved compensating controls where needed.
7. Add expiry and review to exceptions.
8. Integrate checks into access requests and role changes.
9. Reconcile detected conflicts after provisioning changes.
10. Test representative conflict and exception scenarios.

## Decision points
Prevent conflicts by default for high-impact combinations; allow controlled exceptions only with documented rationale and independent monitoring.

## Common failure patterns
Checking only role names, ignoring nested access, permanent exceptions, false positives from unused permissions, and compensating controls that are never tested.

## Verification
Create test identities with conflicting combinations and confirm prevention, detection, escalation, and exception expiry.

## Expected output
Conflict matrix, enforcement rules, exception process, compensating controls, and evidence.

## Stop conditions
Escalate when business process ownership is unclear or a critical conflict cannot be prevented or monitored.