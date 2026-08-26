# Authoritative DNS Rules

## Purpose
Protect correctness and availability of authoritative DNS.

## Scope
Primary/secondary authoritative servers, hosted DNS, and zone publication.

## MUST
- Authoritative servers MUST answer only for zones they are configured to serve and MUST expose intended AA semantics.
- Critical zones MUST have multiple reachable authoritative endpoints with health monitoring.
- Zone publication MUST preserve a known-good version and a tested rollback path.

## MUST NOT
- MUST NOT expose recursion on authoritative-only infrastructure unless explicitly required and secured.
- MUST NOT publish unreviewed zone data directly to production.

## SHOULD
- Authoritative topology SHOULD minimize correlated provider, network, and geographic failure.
- Changes SHOULD be staged and validated from external vantage points.

## Exceptions
Any exception requires evidence, blast-radius analysis, rollback steps, and approval.

## Verification
Use authoritative queries, delegation checks, external probes, configuration review, and controlled failure testing.