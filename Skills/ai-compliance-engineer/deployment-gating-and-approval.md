# Deployment Gating and Approval

## Purpose
Create risk-based compliance gates that prevent AI systems from reaching production without required assessments, controls, tests, and accountable approvals.

## When to use
Use for new AI launches, material changes, high-risk feature activation, geographic expansion, or production restoration after major compliance findings.

## Inputs
Risk classification, impact assessment, control status, evaluation results, vendor review, documentation, open findings, release plan.

## Preconditions
Launch criteria and approval authorities are defined by risk tier.

## Context to inspect
CI/CD process, feature flags, model registry, prompt registry, release checklist, change tickets, control evidence, exception register.

## Core knowledge
A release gate should be evidence-based and proportionate. It must distinguish blocking requirements from advisory findings and should be technically enforceable where practical.

## Procedure
1. Determine the applicable gate based on system risk.
2. Check required assessments and documentation.
3. Verify mandatory controls are implemented and tested.
4. Confirm required model/system evaluations pass.
5. Review unresolved findings and exceptions.
6. Confirm accountable owners and operational monitoring.
7. Obtain required approvals.
8. Bind approval to exact model/configuration versions.
9. Release through controlled rollout.
10. Capture production verification and update records.

## Decision points
Block release when mandatory controls or evidence are missing. Allow time-bounded exceptions only under approved authority with explicit compensating controls and expiry.

## Common failure patterns
Approval detached from artifact versions, checklist-only gates, permanent exceptions, manual gates bypassed during urgent releases, and no post-deployment verification.

## Verification
Confirm production versions match approved artifacts and every blocking criterion has evidence or an authorized exception.

## Expected output
A signed, version-bound release decision with evidence references, exceptions, monitoring requirements, and rollback conditions.

## Stop conditions
Stop deployment when required approval is absent, high-risk findings remain unaccepted, or production configuration cannot be bound to reviewed artifacts.