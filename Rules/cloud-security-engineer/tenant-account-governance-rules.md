# Tenant and Account Governance

## Purpose
Maintain secure cloud organizational boundaries and ownership.

## Scope
Organizations, tenants, accounts, subscriptions, projects, folders, management groups, and landing zones.

## MUST
- Every cloud account or equivalent boundary MUST have an owner, purpose, environment classification, and lifecycle state.
- Organization-level guardrails MUST protect critical identity, logging, billing, and security controls from workload administrators.
- New boundaries MUST inherit required baseline policies before hosting sensitive workloads.
- Closure or transfer of production boundaries MUST include data, identity, logging, and dependency review.

## MUST NOT
- MUST NOT create unmanaged shadow accounts for convenience.
- MUST NOT place unrelated high-trust and low-trust workloads together when separation materially reduces blast radius.

## SHOULD
- Automate account vending and baseline attachment.
- Quarantine orphaned boundaries until ownership is restored.

## Exceptions
Require documented rationale, owner, risk, compensating governance, and approval.

## Verification
Compare provider inventory with authoritative ownership records; inspect inherited policies, logging, identity controls, lifecycle status, and orphan reports.