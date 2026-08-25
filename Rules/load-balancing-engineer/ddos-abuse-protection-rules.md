# DDoS and Abuse Protection Rules

## Purpose
Maintain service availability under volumetric, connection, and application-layer abuse without blocking legitimate traffic unnecessarily.

## Scope
Rate limiting, connection limiting, upstream scrubbing, WAF integration, bot controls, and emergency traffic policies.

## MUST
- Protection thresholds MUST be based on normal traffic, capacity, and attack scenarios rather than arbitrary values.
- Rate limits MUST define scope, key, burst behavior, rejection response, and failure mode.
- Emergency controls MUST have authorized activation procedures and rollback criteria.
- Upstream provider limits and escalation paths MUST be known for critical public services.
- Mitigation changes MUST be monitored for false positives and legitimate-traffic impact.

## MUST NOT
- MUST NOT use easily spoofed identifiers as the sole enforcement key for high-value protections.
- MUST NOT deploy broad blocking rules without understanding likely collateral impact.
- MUST NOT disable protections after an incident without verifying the threat has subsided.

## SHOULD
- Layer volumetric and application-level controls.
- Predefine incident playbooks for common attack classes.

## Exceptions
Emergency broad filtering requires incident authority, explicit scope, continuous observation, and prompt removal when no longer justified.

## Verification
Review rate-limit metrics, rejected traffic, origin saturation, provider telemetry, attack simulations where safe, and post-incident evidence.