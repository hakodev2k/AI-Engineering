# Firewall Policy Engineering

## Purpose
Create maintainable least-privilege firewall policy with explicit ownership, lifecycle, and evidence.

## When to use
Use for rule creation, cleanup, migration, recertification, or incident containment.

## Inputs
Requested flows, owners, endpoints, ports/protocols, duration, risk context, policy and hit data.

## Context to inspect
Rule order, objects, NAT, zones, shadowed rules, defaults, HA state, logging, change windows.

## Core knowledge
Stateful filtering, first-match semantics, NAT interactions, ephemeral ports, application-aware rules, rule shadowing, policy sprawl.

## Procedure
1. Validate business need and owner.
2. Resolve precise endpoints and services.
3. Search existing equivalent coverage.
4. Minimize scope and duration.
5. Place the rule according to platform semantics.
6. Enable useful logging.
7. Peer-review risky changes.
8. Apply through controlled change management.
9. Test intended and prohibited traffic.
10. Record expiry and recertification metadata.

## Decision points
Prefer application or identity selectors when stable; use network selectors for interoperability. Use temporary rules for uncertain or time-bound needs.

## Common failure patterns
Any-any permits, duplicate objects, unowned rules, wrong ordering, forgotten NAT, disabled logging, permanent emergency rules.

## Verification
Confirm rule hits, expected sessions, application success, negative-path denial, and no unintended shadowing.

## Expected output
Minimal policy change, rationale, owner, expiry, test evidence, rollback instructions.

## Stop conditions
Escalate ambiguous requests, broad unrestricted access, missing ownership, or changes without safe rollback.