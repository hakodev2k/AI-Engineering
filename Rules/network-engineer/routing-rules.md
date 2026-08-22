# Routing Rules

## Purpose
Maintain deterministic, loop-resistant, failure-aware reachability.

## Scope
Static routing, dynamic routing protocols, route redistribution, filtering, and path selection.

## MUST
- Define accepted and advertised prefixes explicitly at trust or administrative boundaries.
- Validate convergence, asymmetric-path implications, and failure behavior before production routing changes.
- Control redistribution with explicit policy and loop prevention.
- Preserve a tested recovery path for high-impact route-policy changes.

## MUST NOT
- Advertise broad prefixes merely to mask incomplete routing design.
- Accept unrestricted external or cross-domain routes without justified policy.

## SHOULD
- Prefer deterministic policy and summarization where operationally safe.

## Exceptions
Temporary routing workarounds require scope, expiry, monitoring, risk, and approval proportional to blast radius.

## Verification
Compare intended policy with route tables, protocol state, prefix filters, path tests, and failover evidence.