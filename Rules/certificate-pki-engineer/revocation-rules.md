# Revocation Rules

## Purpose
Remove trust promptly when certificate status or key assurance is no longer valid.

## Scope
Revocation decisions, CRLs, OCSP, subscriber requests, and compromise events.

## MUST
- Revocation criteria, authority, reason codes, and target response times MUST be documented.
- Confirmed private-key compromise MUST trigger revocation according to the applicable policy without avoidable delay.
- Revocation publication MUST be monitored for freshness and reachability.
- Bulk revocation MUST include dependency and outage impact analysis.

## MUST NOT
- MUST NOT delay revocation merely to hide operational impact.
- MUST NOT revoke large populations without approved execution and recovery planning unless immediate containment is required.
- MUST NOT silently ignore failed status publication.

## SHOULD
- Revocation workflows SHOULD be tested before incidents occur.

## Exceptions
Any delay requires explicit risk acceptance by authorized security and service owners.

## Verification
Test CRL/OCSP publication, sample status responses, review incident timelines, and inspect monitoring.