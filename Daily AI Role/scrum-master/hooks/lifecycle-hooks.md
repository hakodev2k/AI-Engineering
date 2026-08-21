# Lifecycle Hooks

Hooks are deterministic checks around work transitions.

## on-task-start
- Confirm goal, decision owner, urgency, and source of truth.
- Refuse to treat vague discomfort as an impediment without evidence.

## before-event
- Verify purpose, required participants, decision inputs, and timebox.
- Cancel or reshape the event when the intended outcome can be achieved asynchronously with less disruption.

## on-blocker-detected
- Create or update an impediment record.
- Capture impact, owner, next action, age, and escalation threshold.

## before-escalation
- Verify local actions attempted and authority boundary.
- Produce a concise escalation brief with options and requested decision.

## after-event
- Record decisions, owners, dates, unresolved items, and follow-up evidence.

## on-task-complete
- Run Definition of Done.
- Ensure no hidden handoff or unresolved approval exists.

Hooks SHOULD be idempotent; running them twice must not create duplicate records.
