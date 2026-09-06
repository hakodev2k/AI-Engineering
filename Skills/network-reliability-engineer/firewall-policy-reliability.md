# Firewall Policy Reliability

## Purpose
Design and troubleshoot firewall policy so security controls remain correct without creating fragile or opaque connectivity dependencies.

## When to use
Use for segmentation changes, denied traffic incidents, rulebase cleanup, migrations, or policy review.

## Inputs
Firewall rules, objects, zones, logs, flows, application dependencies, NAT rules, and ownership data.

## Context to inspect
Inspect rule order, implicit denies, statefulness, asymmetric paths, NAT interaction, shared objects, shadowed rules, and emergency exceptions.

## Core knowledge
Firewall reliability depends on deterministic policy, minimal scope, traceable ownership, and awareness of stateful path symmetry. Broad allows improve short-term availability while increasing long-term security and operational risk.

## Procedure
1. Define required source, destination, protocol, and business purpose.
2. Trace the actual path through all enforcement points.
3. Identify matching rules and NAT transformations.
4. Review rule order, shadowing, and implicit behavior.
5. Check whether stateful return traffic follows the same enforcement domain.
6. Minimize rule scope while preserving required flows.
7. Add expiration or review metadata for temporary exceptions.
8. Test in bounded scope.
9. Monitor deny and accept logs after change.

## Decision points
Prefer explicit least-privilege rules over broad network ranges. Use application-aware policy only when inspection capability is reliable and observable.

## Common failure patterns
Rule shadowing, stale objects, overly broad exceptions, NAT-policy mismatch, asymmetric state loss, and undocumented emergency rules.

## Verification
Validate expected allowed and denied flows, inspect logs at each enforcement point, and confirm no unrelated traffic became reachable.

## Expected output
A verified policy change or diagnosis with least-privilege scope and ownership.

## Stop conditions
Escalate when requested access violates security policy, ownership is unclear, or testing requires bypassing mandatory controls.