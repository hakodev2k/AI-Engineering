# Security and Access Control

## Purpose
Enforce least privilege across broker resources.

## Scope
Authentication, authorization, ACLs, service identities, administration, and network access.

## MUST
- Producers, consumers, and operators MUST use distinct least-privilege identities where feasible.
- Administrative privileges MUST be restricted, auditable, and reviewed.
- Access changes affecting production or sensitive data MUST require authorized approval.

## MUST NOT
- MUST NOT use anonymous or shared privileged credentials in production.
- MUST NOT disable authorization to resolve application integration failures.

## SHOULD
- Automate policy validation and periodic entitlement review.

## Exceptions
Require time-bounded access, rationale, risk, compensating controls, and approval.

## Verification
Review ACLs/RBAC, identity mappings, audit logs, network policy, and access tests.