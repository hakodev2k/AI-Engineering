# Access Reviews and Certification

## Purpose
Run evidence-based access certifications that remove stale or excessive access rather than merely collecting approvals.

## When to use
Use for periodic reviews, privileged-access certification, regulatory controls, application-owner attestations, or post-reorganization cleanup.

## Inputs
Effective access data, entitlement descriptions, owners, user status, job context, usage evidence, risk tiers, and prior review decisions.

## Context to inspect
Inspect direct and inherited access, dormant accounts, privileged grants, exceptions, nested groups, review scope, revocation execution, and unresolved prior findings.

## Core knowledge
Reviewers need understandable access context and consequence. Reviewing configured membership without resolving inheritance can miss effective privilege. Certification is incomplete until revoked access is actually removed.

## Procedure
1. Define review scope from risk and compliance needs.
2. Resolve effective access and inheritance.
3. Enrich each item with business meaning, owner, user context, and usage where available.
4. Prioritize privileged, anomalous, and stale access.
5. Assign informed reviewers and prevent self-certification where inappropriate.
6. Require explicit retain/revoke decisions with justification for sensitive access.
7. Execute revocations promptly.
8. Track failures and exceptions to closure.
9. Sample decisions for quality.
10. Improve entitlement design based on recurring review noise.

## Decision points
Use targeted risk-based reviews more frequently for sensitive access and broader periodic reviews for lower-risk access. Usage evidence informs decisions but does not alone prove business need.

## Common failure patterns
Certify-all behavior, reviewing unreadable IDs, ignoring nested access, no revocation follow-through, self-review, and treating dormant use as automatically safe.

## Verification
Reconcile certified decisions against post-review effective access and verify all revocations and exceptions reached a final state.

## Expected output
A completed certification with defensible decisions, executed remediation, exceptions, metrics, and evidence.

## Stop conditions
Stop when access data is materially incomplete, reviewers lack ownership/context, or revocation cannot be verified.