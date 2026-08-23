# Incident Command

## Purpose
Coordinate people, decisions, evidence, and communications during complex incidents without turning the incident commander into the primary debugger.

## When to use
Use for incidents requiring multiple responders, teams, workstreams, or executive/customer coordination.

## Inputs
Incident severity, responders, current impact, active hypotheses, mitigation options, communication obligations, and available runbooks.

## Context to inspect
Inspect team ownership, escalation paths, dependency owners, decision authority, current workstreams, and operational constraints.

## Core knowledge
Incident command separates coordination from technical execution. Clear roles reduce duplicated work, conflicting changes, and cognitive overload. The commander maintains shared state and decision quality.

## Procedure
1. Declare the incident and establish one authoritative channel.
2. Assign incident commander, technical lead, communications lead, and scribe as needed.
3. State impact, severity, known facts, and immediate objective.
4. Divide investigation into bounded workstreams with owners.
5. Set update checkpoints and require evidence-based reports.
6. Track decisions, changes, risks, and rollback options.
7. Prevent simultaneous conflicting production changes.
8. Reallocate responders as hypotheses are eliminated.
9. Escalate specialist or leadership support when thresholds are met.
10. Transfer command explicitly if ownership changes.
11. Close command only after recovery criteria and follow-up ownership are clear.

## Decision points
Use a dedicated commander when coordination overhead exceeds one responder's capacity. Add workstreams only when they investigate independent hypotheses or execute independent mitigations.

## Common failure patterns
Commander debugging instead of coordinating, unclear ownership, uncontrolled chat threads, too many responders, undocumented changes, and status meetings that interrupt recovery work.

## Verification
Confirm every active action has one owner, shared status is current, conflicting changes are prevented, and stakeholders receive updates at the agreed cadence.

## Expected output
A controlled response structure with roles, workstreams, decisions, actions, and status checkpoints.

## Stop conditions
Escalate when no authorized decision maker is available for high-risk mitigation or organizational boundaries prevent effective command.