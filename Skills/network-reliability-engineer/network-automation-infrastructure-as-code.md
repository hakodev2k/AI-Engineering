# Network Automation and Infrastructure as Code

## Purpose
Automate network configuration safely using declarative definitions, validation, drift detection, reviewable changes, and controlled deployment.

## When to use
Use for repeated configuration, multi-environment consistency, cloud networking, firewall policy generation, or reducing manual change risk.

## Inputs
Current configurations, source-of-truth data, IaC code, device/provider APIs, policy requirements, CI/CD controls, and state information.

## Context to inspect
Inspect authoritative ownership, generated vs hand-managed configuration, state backends, credentials boundaries, drift, provider versioning, and rollback capability.

## Core knowledge
Automation magnifies both correctness and mistakes. Reliable network automation requires idempotency, deterministic inputs, pre-deployment validation, bounded rollout, and a trustworthy source of truth.

## Procedure
1. Identify configuration suitable for automation.
2. Define authoritative structured inputs.
3. Model desired state declaratively where possible.
4. Add syntax, schema, policy, and topology validation.
5. Generate and review exact changes before apply.
6. Test against nonproduction or virtualized environments.
7. Stage rollout by device, site, or network domain.
8. Verify live state after apply.
9. Detect and reconcile drift deliberately.
10. Keep rollback artifacts and change history.

## Decision points
Use declarative IaC for stable desired-state resources; use procedural automation for diagnostics or workflows requiring ordered runtime decisions. Never auto-reconcile drift blindly when human changes may be intentional.

## Common failure patterns
Unvalidated bulk changes, stale source-of-truth data, secrets embedded in code, provider-version drift, non-idempotent scripts, and automation that cannot distinguish intended exceptions.

## Verification
Run plan/diff checks, automated policy tests, targeted post-change probes, and drift scans.

## Expected output
A reproducible automation workflow with reviewable changes, evidence-based validation, and rollback.

## Stop conditions
Escalate when source-of-truth authority is ambiguous, state is inconsistent, or automation would touch unmanaged critical infrastructure.