# Access Request and Approval Workflows

## Purpose
Design request and approval flows that grant only justified access, capture accountable decisions, and automatically expire temporary privileges.

## When to use
Use for requestable roles, elevated access, application onboarding, or replacement of manual ticket-based grants.

## Inputs
Entitlements, owners, risk tiers, approval rules, business justification, expiry rules, provisioning targets.

## Context to inspect
Current tickets, catalogs, role owners, fulfillment automation, exception flows, approval history, SLA data.

## Core knowledge
Approval is not a substitute for good entitlement design. High-volume low-risk access should be policy-driven; high-impact access needs stronger evidence and accountable approval.

## Procedure
1. Classify entitlements by risk.
2. Assign accountable owners.
3. Define required request context and justification.
4. Automate low-risk policy decisions where safe.
5. Require additional approval for privileged or conflicting access.
6. Add default expiry for temporary grants.
7. Provision only after final approval.
8. Record decision evidence and policy version.
9. Define cancellation and revocation behavior.
10. Measure approval latency, rejection, and stale grants.

## Decision points
Use manager approval for business need, resource-owner approval for sensitive resources, and security approval only when risk requires specialist judgment.

## Common failure patterns
Rubber-stamp approvals, permanent temporary access, unclear entitlement names, self-approval, and manual fulfillment that diverges from approved scope.

## Verification
Test approved, denied, expired, cancelled, conflicting, and failed-provisioning cases end-to-end.

## Expected output
Request catalog, approval matrix, expiry policy, workflow rules, and audit evidence.

## Stop conditions
Escalate when entitlement ownership is unknown or required separation-of-duties controls cannot be enforced.