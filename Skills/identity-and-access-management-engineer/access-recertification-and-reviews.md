# Access Recertification and Reviews

## Purpose
Run evidence-based access reviews that identify unnecessary, excessive, stale, or conflicting entitlements and drive verified revocation.

## When to use
Use for periodic certification, high-risk systems, privileged groups, audit remediation, or role cleanup.

## Inputs
Identity population, entitlements, owners, usage evidence, risk tiers, policy constraints, review cadence.

## Context to inspect
Current access, historical changes, login/use signals, role mappings, exceptions, prior certifications, terminated identities.

## Core knowledge
A review is valuable only when reviewers understand the entitlement, have enough evidence, and revocation is completed. Reviewing every low-risk grant equally creates fatigue.

## Procedure
1. Scope reviews by risk and ownership.
2. Normalize entitlement names into business-readable descriptions.
3. Include grant source, last use, age, and conflicts.
4. Assign accountable reviewers.
5. Require explicit keep/revoke decisions for high-risk access.
6. Auto-expire unanswered temporary access where policy permits.
7. Route revocations to deterministic fulfillment.
8. Reconcile completed decisions against actual target state.
9. Track exceptions with expiry.
10. Analyze recurring excess access and redesign roles upstream.

## Decision points
Use campaign reviews for broad governance; event-driven reviews for role changes, inactivity, or risk events.

## Common failure patterns
Reviewer overload, entitlement names with no context, certifying access never used, decisions not provisioned, and managers approving privileges they do not understand.

## Verification
Sample completed reviews and prove revoked entitlements are actually absent in target systems.

## Expected output
Review scope, evidence model, reviewer mapping, decisions, remediation status, and residual exceptions.

## Stop conditions
Escalate when ownership cannot be established or target systems cannot prove/remediate access state.