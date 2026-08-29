# Decision Log and Governance

## Purpose
Create a lightweight governance system that makes consequential technical and program decisions explicit, timely, owned, and traceable.

## When to use
Use when a program has many cross-team decisions, architecture trade-offs, approval gates, or recurring ambiguity about who decides what.

## Inputs
Open decisions, stakeholder map, charter, architecture records, risks, escalation paths.

## Context to inspect
Existing ADRs, approval processes, meeting records, ownership boundaries, prior reversals, and policy constraints.

## Core knowledge
Decision latency is a program risk. Senior TPMs distinguish reversible from irreversible decisions, define decision authority, and ensure rationale and downstream implications are preserved.

## Procedure
1. List unresolved decisions that can block progress or change outcomes.
2. Classify each by impact, reversibility, urgency, and required authority.
3. Assign a decision owner and decision-by date.
4. Prepare concise options, trade-offs, recommendation, and evidence.
5. Record the final decision, rationale, dissent, and follow-up actions.
6. Communicate consequences to affected teams.
7. Link decisions to milestones, risks, and architecture artifacts.
8. Reopen only when assumptions or evidence materially change.

## Decision points
Use lightweight local decisions for reversible choices; require broader governance for security, regulatory, customer-impacting, or difficult-to-reverse changes.

## Common failure patterns
No decision owner, endless consensus seeking, undocumented reversals, decisions hidden in chat, and approval after implementation.

## Verification
Confirm each critical open decision has an owner/date and each closed decision has rationale plus downstream actions.

## Expected output
A durable decision log and governance cadence that reduces ambiguity and delay.

## Stop conditions
Escalate when authority is contested, required evidence is unavailable, or the decision exceeds delegated program scope.