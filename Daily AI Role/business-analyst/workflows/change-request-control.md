# Change Request Control Workflow

## Trigger
An approved/baselined requirement changes.

## Goal
Evaluate impact before changing committed behavior.

## Stages
1. Capture delta and reason; preserve original requirement ID/version.
2. Run gap and impact analysis across personas, process, data, systems, integrations, reporting, operations, training, and commitments.
3. Identify dependency and sequencing changes.
4. Compare options: accept now, defer, split, reject; state trade-offs and reversibility.
5. Require human approval for changes affecting money, legal/compliance, privacy, security, destructive data behavior, external commitments, or contractual scope.
6. Update requirement, decision, acceptance, traceability, and handoff artifacts atomically.
7. Re-review impacted acceptance criteria and release scope.

## Parallel work
Process and traceability reviews MAY run in parallel after the delta is fixed. Approval and baseline mutation MUST be serialized.

## Retry
One clarification round per unresolved owner; after two unanswered attempts, escalate with impact and deadline.

## Definition of Done
Change reason, owner, impact, approval, revised acceptance, dependency changes, and superseded state are recorded.