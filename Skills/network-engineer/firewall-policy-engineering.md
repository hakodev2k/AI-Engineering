# Firewall Policy Engineering

## Purpose
Design and maintain firewall policy that enforces least privilege while remaining auditable, understandable, and operationally safe.

## When to use
Use for new application flows, firewall migrations, rule cleanup, incident containment, partner connectivity, or policy reviews.

## Inputs
Source/destination identities or networks, protocols, ports, application behavior, data classification, ownership, expiry needs, and firewall topology.

## Context to inspect
Inspect routing/NAT order, zones, existing objects, rule precedence, shadowed rules, logs, asymmetric paths, stateful behavior, and change windows.

## Core knowledge
Firewall rules should represent business-approved flows, not troubleshooting guesses. Broad rules accumulate risk and obscure intent. Stateful inspection, NAT, and routing interactions must be understood before policy changes.

## Procedure
1. Confirm the exact required flow and owner.
2. Verify source, destination, protocol, direction, and path.
3. Search for existing applicable rules and objects.
4. Design the narrowest maintainable rule.
5. Add description, owner, ticket/reference, and expiry where temporary.
6. Validate NAT and route interactions.
7. Stage and monitor the change.
8. Test allowed and explicitly forbidden paths.
9. Review hit counts and remove obsolete temporary access.

## Decision points
Use application/identity-aware policy when reliable; use network/port rules when those controls are unavailable. Aggregate rules only when trust and lifecycle are genuinely shared.

## Common failure patterns
Any-any rules, unused permanent exceptions, wrong rule order, forgotten return path, hidden NAT effects, duplicated objects, and testing only successful access.

## Verification
Confirm intended traffic succeeds, unauthorized variants fail, logs identify decisions, rule metadata is complete, and no unrelated policy was widened.

## Expected output
A minimal auditable firewall change with evidence and rollback instructions.

## Stop conditions
Escalate when ownership or business justification is missing, requested access violates policy, or the path cannot be safely identified.