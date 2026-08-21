# Skill: Coordination and Delegation

## Purpose
Coordinate multiple responders under pressure while keeping one authoritative operational picture, minimizing duplicated work, and ensuring that every critical task has an owner and completion signal.

## Trigger
Use when an incident has more than one investigation, mitigation, communication, or dependency workstream.

## Inputs
- Current incident brief and severity
- Active responders and their capabilities
- Investigation hypotheses
- Candidate mitigations
- Stakeholder communication needs
- Approval boundaries

## Procedure
1. Convert the incident into explicit workstreams such as application, database, infrastructure, dependency, customer communication, and evidence capture.
2. For each workstream define: objective, owner, expected output, deadline/checkpoint, required context, dependencies, and stop condition.
3. Assign one owner per task. Contributors may be many, accountability must not be ambiguous.
4. Parallelize only independent work. If lane B depends on evidence from lane A, record the dependency and do not pretend they are concurrent.
5. Reserve the Incident Commander for coordination, decisions, conflict resolution, and prioritization. The commander should not become the deepest debugger unless staffing requires it.
6. Route technical investigation to `subagents/technical-investigator.md`, communications to `subagents/communications-officer.md`, and timeline/evidence quality to `subagents/evidence-keeper.md`.
7. Require updates in a compact format: `state | evidence | next action | blocker | ETA/checkpoint`.
8. At each synchronization point, merge duplicate hypotheses, close stale tasks, reassign blockers, and update priority.
9. Maintain a visible decision log for mitigations, severity changes, rollback decisions, and escalation.
10. Protect responders from unbounded ad-hoc requests; route external questions through the communications lane unless they materially affect technical decisions.

## Prioritization model
Rank work by:
1. Immediate safety/security/data risk
2. User/business impact reduction
3. Dependency unblock value
4. Time sensitivity
5. Reversibility
6. Evidence gain per unit effort
7. Cost/effort

When scores are close, prefer work that is reversible and produces evidence quickly.

## Conflict resolution
- Conflicting technical recommendations: request evidence, reversible experiment, and blast-radius comparison.
- Two teams claim ownership: assign temporary incident ownership immediately; resolve organizational ownership later.
- Resource contention: pause lower-impact work and explicitly record the displaced task.
- Stakeholder pressure for premature root cause: provide current facts and uncertainty instead of speculation.

## Outputs
- Active workstream board
- Ownership map
- Dependency map
- Decision log
- Synchronization schedule
- Escalation list

## Quality criteria
- No critical task is ownerless.
- No active task has an undefined expected output.
- Duplicate investigations are intentionally consolidated.
- The commander can explain why the top three tasks are currently highest priority.

## Failure handling
If coordination overhead becomes larger than incident work, collapse workstreams, reduce update frequency, and keep only critical lanes. If responders are overloaded, escalate for staffing instead of silently extending deadlines.

## Stop conditions
Coordination can transition to recovery mode when impact is controlled, active lanes are reduced to verification/remediation, and ownership for follow-up work is established.