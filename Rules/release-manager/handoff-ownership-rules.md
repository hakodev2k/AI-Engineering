# Handoff and Ownership Rules

## Purpose
Prevent release risk from falling between teams when responsibility moves across development, operations, support, security, vendors, or time zones.

## Scope
Applies to readiness ownership, execution handoffs, operational support, follow-up actions, and release closure.

## MUST
- Every material release responsibility MUST have an accountable owner and a defined handoff point.
- Handoffs MUST communicate current state, completed and pending actions, known risks, active exceptions, required decisions, and relevant evidence.
- Receiving owners MUST explicitly acknowledge safety-critical handoffs before responsibility is considered transferred.
- On-call and support ownership MUST be known for the observation and recovery period.
- Deferred defects, temporary controls, and follow-up work MUST retain named ownership and target review criteria after release closure.

## MUST NOT
- Responsibility MUST NOT be assigned to a team name alone when no accountable person or rota can be reached for a critical decision.
- A handoff MUST NOT omit unresolved risk merely because it has already been documented elsewhere.
- Release closure MUST NOT silently terminate ownership of temporary mitigations or exceptions.

## SHOULD
- Standard handoff templates SHOULD be used for complex or cross-time-zone releases.
- Handoffs SHOULD link to authoritative evidence rather than duplicate mutable status text.

## Exceptions
When immediate incident response prevents formal acknowledgement, incident command may assign temporary ownership; the assignment and subsequent formal handoff must be recorded as soon as practical.

## Verification
Review ownership fields, acknowledgement records, on-call/support coverage, handoff notes, open exceptions, follow-up tickets, and whether accountable owners remained reachable throughout the risk window.