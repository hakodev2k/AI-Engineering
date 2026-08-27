# Security Policy Automation Rules

## Purpose
Ensure automated ACL, firewall, segmentation, and management-plane policy changes preserve least privilege and reviewability.

## Scope
ACLs, security groups, firewall rules, management access, segmentation, and policy generation.

## MUST
- Security rules MUST identify source, destination, protocol/service, direction, scope, and business or technical intent.
- Policy generation MUST default to the narrowest authorized scope and validate object references.
- Rule ordering and shadowing effects MUST be analyzed when semantics are order-dependent.
- Privilege-expanding changes MUST receive explicit review appropriate to risk.
- Temporary access MUST have an owner and expiry mechanism.

## MUST NOT
- MUST NOT introduce broad any-to-any access merely to resolve an automation failure.
- MUST NOT disable management-plane protection, authentication, or encryption without explicit security approval.
- MUST NOT delete security rules solely because telemetry shows no recent matches when dependency evidence is incomplete.

## SHOULD
- Policy SHOULD be tested against representative allowed and denied flows.
- Stale or redundant rules SHOULD be reported separately from automatic removal unless removal policy is approved.

## Exceptions
Emergency access requires bounded scope and duration, incident/change reference, approver, monitoring, and mandatory revocation verification.

## Verification
Run policy simulation or tests, inspect diffs and ordering, validate temporary-rule expiry, review privilege expansion, and verify representative permitted and denied flows.