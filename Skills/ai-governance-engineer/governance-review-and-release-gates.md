# Governance Review and Release Gates

## Purpose
Run risk-proportionate governance reviews that produce clear release decisions based on verified evidence.

## When to use
Use at initial deployment, major change, high-risk renewal, or when monitoring triggers reassessment.

## Inputs
Inventory record, risk classification, impact assessment, evaluations, control evidence, vendor review, security/privacy findings, exceptions, deployment plan.

## Procedure
1. Confirm exact system/version and intended release scope.
2. Validate risk tier and required gate criteria.
3. Check mandatory evidence for completeness and freshness.
4. Review unresolved findings and exceptions.
5. Confirm evaluation thresholds and production monitoring.
6. Verify rollback, incident, and human-oversight readiness where relevant.
7. Distinguish blocking findings from accepted residual risks.
8. Record approve, approve-with-conditions, restrict, or reject decision.
9. Bind decision to release artifact and conditions.
10. Define expiry and reassessment triggers.

## Decision points
Conditional approval is appropriate only when remaining conditions do not invalidate minimum release criteria. Do not turn gates into document-presence checks.

## Common failure patterns
Reviewing stale artifacts, ambiguous approval scope, verbal waivers, late governance review, conditions with no owner, approval not bound to version.

## Verification
Deployment artifact can be traced to a valid decision and every gate criterion has verified evidence or authorized exception.

## Expected output
Release decision record with scope, evidence, conditions, and reassessment triggers.

## Stop conditions
Reject or escalate when blocking evidence is missing, critical controls are unverified, or approver authority is insufficient.