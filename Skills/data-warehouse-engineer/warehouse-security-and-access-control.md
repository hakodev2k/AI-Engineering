# Warehouse Security and Access Control

## Purpose
Design least-privilege warehouse access that protects sensitive analytical data without making legitimate analysis operationally brittle.

## When to use
Use when onboarding users or services, exposing new datasets, handling regulated data, or reviewing excessive warehouse privileges.

## Inputs
Data classifications, identities, roles, datasets, consumer use cases, compliance requirements, platform IAM capabilities.

## Context to inspect
Existing grants, group membership, service identities, row/column policies, audit logs, data sharing, secrets, and ownership boundaries.

## Core knowledge
Warehouse security combines identity, role design, object permissions, row/column controls, masking, encryption, auditability, and separation of duties. Authorization should align with data sensitivity and job function, not convenience.

## Procedure
1. Classify data and identify sensitive fields.
2. Inventory human and workload identities.
3. Map legitimate actions to role-based permissions.
4. Remove direct individual grants when group or role grants suffice.
5. Apply row/column restrictions and masking where required.
6. Separate administrative, engineering, and consumption privileges.
7. Protect credentials and prefer workload identity over long-lived secrets.
8. Enable and retain access/audit logs.
9. Test denied as well as allowed scenarios.
10. Establish periodic access review and revocation processes.

## Decision points
Use physical isolation when policy boundaries are strong and persistent. Use policy-based controls when shared datasets require governed subsets. Prefer dynamic masking only when consumers do not require raw values.

## Common failure patterns
Overbroad admin roles, forgotten service accounts, copied sensitive tables outside policy scope, security-through-obscure views, and unreviewed cross-account shares.

## Verification
Execute access tests for representative roles, inspect audit events, confirm sensitive fields remain protected in derived datasets, and review effective permissions.

## Expected output
A documented access model with least-privilege roles, protection controls, and audit evidence.

## Stop conditions
Stop when required access conflicts with policy or legal requirements and no authorized exception exists.