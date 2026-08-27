# Firewall and ACL Engineering

## Purpose
Implement and troubleshoot packet-filtering policy with least privilege, deterministic ordering, and safe lifecycle management.

## When to use
Use for new application flows, firewall migrations, denied traffic, rule cleanup, or exposure reduction.

## Inputs
Source/destination identities, protocols/ports, direction, business justification, topology, NAT, logs, current policy, and change window.

## Context to inspect
Rule order, implicit policy, object groups, zones/interfaces, stateful behavior, NAT precedence, return routing, hit counts, logging, and HA state.

## Core knowledge
A rule is correct only in the context of packet path, translation, state, and evaluation order. Minimize scope; separate temporary exceptions; never infer application requirements solely from one packet capture.

## Procedure
1. Confirm business flow and owner.
2. Trace the complete forward and return path.
3. Identify every enforcement point.
4. Determine pre/post-NAT addresses relevant to each device.
5. Search existing rules and objects for overlap.
6. Define minimum sources, destinations, services, and direction.
7. Place policy according to platform evaluation semantics.
8. Enable useful logging without creating unsustainable volume.
9. Validate configuration syntax and shadowing.
10. Implement with rollback criteria.
11. Test allowed flow and representative denied flows.
12. Review hit counts and remove temporary rules on schedule.

## Decision points
Prefer application-aware policy when it is reliable and operationally supported; use L3/L4 policy for deterministic foundational controls. Aggregate rules only when trust and lifecycle are truly shared.

## Common failure patterns
Any-any exceptions, wrong NAT perspective, shadowed rules, stale objects, missing return route, disabling inspection to fix symptoms, rules without owners, and permanent emergency access.

## Verification
Confirm session establishment, expected rule hit, translation, return path, denied negative tests, logging, and HA consistency.

## Expected output
Minimal policy change, evidence of path/rule behavior, owner/expiry metadata, test results, and rollback plan.

## Stop conditions
Stop when flow ownership or data sensitivity is unknown, requested access violates policy, the change exposes management interfaces, or production impact cannot be bounded.