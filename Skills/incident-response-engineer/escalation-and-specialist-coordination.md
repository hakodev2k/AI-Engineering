# Escalation and Specialist Coordination

## Purpose
Bring the right expertise and authority into an incident at the right time while keeping ownership and information flow controlled.

## When to use
Use when incident scope exceeds current expertise, decision authority, service ownership, or recovery capability.

## Inputs
Incident severity, affected components, current hypotheses, blocked actions, ownership map, escalation policies, and vendor contacts.

## Context to inspect
Inspect on-call rotations, service ownership, security/legal/compliance triggers, vendor support tiers, executive escalation thresholds, and time-zone coverage.

## Core knowledge
Escalation is risk management, not failure. Good escalation states the decision or expertise needed, provides concise evidence, and preserves one incident command structure.

## Procedure
1. Identify the specific capability, authority, or information missing.
2. Determine the correct owner or specialist.
3. Prepare a concise handoff: impact, severity, timeline, evidence, actions tried, and exact ask.
4. Add the specialist to the authoritative response channel.
5. Assign a bounded workstream or decision responsibility.
6. Avoid repeating full investigation unless necessary.
7. Track external/vendor cases and response commitments.
8. Re-escalate when agreed response thresholds are missed.
9. Release unnecessary responders when their workstream ends.

## Decision points
Escalate early for high-impact unknowns and irreversible decisions. Avoid adding broad groups when one accountable specialist can resolve the gap.

## Common failure patterns
Escalating without an ask, paging everyone, parallel uncoordinated vendor conversations, delayed security/legal escalation, and losing incident ownership after specialists arrive.

## Verification
Confirm the requested expertise or authority is assigned, acknowledged, and integrated into incident command.

## Expected output
A clear escalation record with recipient, reason, evidence, requested action, owner, and status.

## Stop conditions
Escalate further when required authority is unavailable, response commitments are missed, or risk crosses mandatory organizational thresholds.