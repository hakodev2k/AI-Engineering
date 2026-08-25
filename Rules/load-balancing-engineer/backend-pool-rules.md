# Backend Pool Rules

## Purpose
Maintain correct membership, isolation, and capacity of backend pools.

## Scope
Pool membership, discovery, weights, zones, ports, protocols, and backend lifecycle.

## MUST
- Backend membership MUST come from an authoritative source or controlled configuration.
- Every backend MUST satisfy protocol, port, health, identity, and environment expectations before receiving production traffic.
- Pool weights MUST reflect intentional capacity or traffic policy and be reviewed when backend classes change.
- Backend removal MUST coordinate health, draining, and service lifecycle to avoid dropped work.
- Production and non-production pools MUST be clearly separated.

## MUST NOT
- MUST NOT add unknown or unverified endpoints to a production pool.
- MUST NOT mix incompatible backend protocol expectations in one pool unless the load-balancing platform explicitly supports and tests that design.
- MUST NOT rely on stale discovery data without bounded expiry or reconciliation.

## SHOULD
- Automate membership reconciliation and stale-backend removal.
- Spread critical pools across failure domains.

## Exceptions
Manual membership during incidents requires authorized change control and later reconciliation.

## Verification
Compare runtime membership with the authoritative source, inspect health and weights, test drain behavior, and detect stale or cross-environment endpoints.