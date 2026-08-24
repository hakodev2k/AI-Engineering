# Data Access Governance

## Purpose
Design risk-based access governance that gives legitimate users timely access while enforcing least privilege, purpose, and accountability.

## When to use
Use for access-model design, sensitive datasets, audit findings, platform onboarding, or excessive manual approvals.

## Inputs
Data classifications, identity model, roles, purposes, platform permissions, legal constraints, access logs, ownership.

## Context to inspect
Inspect current entitlements, approval flows, service accounts, privileged access, sharing, revocation, and audit evidence.

## Core knowledge
Authorization should combine identity, role/attributes, data sensitivity, purpose, environment, and lifecycle. Governance includes request, approval, provisioning, review, revocation, and evidence.

## Procedure
1. Classify assets and identify legitimate access patterns.
2. Define entitlement units and least-privilege roles/attributes.
3. Assign approval authority based on risk.
4. Automate low-risk standard access where controls are strong.
5. Require stronger review for sensitive or privileged access.
6. Set expiry for temporary access.
7. Govern service/non-human identities separately.
8. Log decisions and usage.
9. Run periodic entitlement reviews based on risk.
10. Detect dormant, anomalous, and orphan access.
11. Test revocation and emergency access.

## Decision points
Use RBAC for stable job patterns; ABAC where context materially affects decisions. Prefer just-in-time privileged access over standing privilege where supported.

## Common failure patterns
Permanent access, owner rubber-stamping, shared accounts, manual spreadsheets, overbroad groups, no revocation, and reviews based only on entitlement lists without usage.

## Verification
Test request-to-revocation journeys, unauthorized attempts, temporary expiry, owner evidence, and audit reconstruction.

## Expected output
Access model, approval rules, lifecycle workflows, review cadence, logging requirements, and exception handling.

## Stop conditions
Escalate conflicting legal/security requirements, unsupported least-privilege controls, or privileged access without accountable approval.