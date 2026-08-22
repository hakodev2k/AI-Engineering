# Product Incident Response

## Purpose
Represent customer and product priorities during incidents, coordinate communication and trade-offs, and convert incident learning into product improvements.

## When to use
Use during outages, data-quality failures, severe regressions, security events, broken integrations, or product behavior causing material customer harm.

## Inputs
Incident severity, affected users, symptoms, telemetry, workarounds, technical status, contractual commitments, support volume, and communication channels.

## Context to inspect
Inspect incident command structure, affected journeys, segment criticality, current mitigations, rollback options, status communications, and historical incidents.

## Core knowledge
During incidents, engineering leads technical diagnosis while product clarifies customer impact, acceptable degradation, priorities, and communication. Avoid speculative causes.

## Procedure
1. Join the established incident process and identify incident commander.
2. Quantify affected users, journeys, regions, and business impact.
3. Clarify which capabilities can be degraded or disabled safely.
4. Provide product context for mitigation trade-offs.
5. Coordinate accurate customer-facing updates with support/comms.
6. Track known workarounds and affected commitments.
7. Avoid introducing unrelated scope during recovery.
8. Validate customer recovery after technical restoration.
9. Participate in blameless post-incident review.
10. Convert systemic findings into prioritized product, operational, or platform actions.

## Decision points
Prefer containment and safe degradation over preserving full functionality when customer harm is growing. Delay nonessential launches during unstable recovery.

## Common failure patterns
Speculating publicly, bypassing incident command, optimizing optics over recovery, declaring resolved before customer verification, and ignoring recurring product design contributors.

## Verification
Affected journeys recover, communications match facts, follow-up actions have owners, and recurrence indicators are defined.

## Expected output
Clear product impact assessment, coordinated decisions, customer communication input, and prioritized follow-up learning.

## Stop conditions
Defer to security/legal/incident leadership when disclosure, forensic integrity, or regulated notification rules apply.