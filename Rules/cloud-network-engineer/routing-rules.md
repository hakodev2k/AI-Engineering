# Routing Rules

## Purpose
Ensure deterministic, least-surprise routing across cloud and hybrid networks.

## Scope
Applies to route tables, dynamic routing, transit gateways, route propagation, preferred paths, and failover routes.

## MUST
- Every production route change MUST identify affected prefixes, next hops, expected path, failure mode, and rollback.
- Route precedence and propagation behavior MUST be understood before enabling dynamic advertisement.
- Critical prefixes MUST have ownership and source-of-truth documentation.
- Routing loops and asymmetric paths MUST be tested for when topology or propagation changes.
- Changes that can redirect broad traffic classes MUST require human approval.

## MUST NOT
- MUST NOT advertise default routes broadly without explicit architecture intent.
- MUST NOT accept overlapping or unexpected prefixes from peers without controls.
- MUST NOT depend on route order assumptions that contradict provider-specific precedence rules.

## SHOULD
- Prefer summarized routes where they preserve isolation and operational clarity.
- Prefer explicit route intent over emergent connectivity.

## Exceptions
Exceptions require topology evidence, impact analysis, safeguards, and approval.

## Verification
Inspect route tables, effective routes, dynamic advertisements, path traces, failover tests, and infrastructure diffs.