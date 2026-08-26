# DNS Security Rules

## Purpose
Reduce DNS abuse, compromise, and unauthorized change risk.

## Scope
DNS infrastructure, management planes, zone data, and resolver controls.

## MUST
- Administrative access MUST use strong authentication, least privilege, and auditable identities.
- DNS infrastructure MUST be patched and hardened according to supported vendor guidance and exposure.
- Unauthorized zone transfer, recursion, and management access MUST be blocked by default.

## MUST NOT
- MUST NOT store DNS credentials or API tokens in source code or logs.
- MUST NOT weaken security controls merely to restore convenience.

## SHOULD
- High-impact changes SHOULD require separation of duties or peer approval.
- Abuse indicators SHOULD feed operational monitoring and response.

## Exceptions
Security exceptions require documented threat impact, compensating controls, expiry, and accountable approval.

## Verification
Review IAM, ACLs, transfer policy, resolver exposure, vulnerability results, audit logs, and configuration scans.