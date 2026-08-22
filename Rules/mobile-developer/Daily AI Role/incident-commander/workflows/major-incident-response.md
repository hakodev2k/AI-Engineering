# Workflow: Major Incident Response

## Trigger
A production event has confirmed or plausible material user, business, data, security, or operational impact requiring coordinated response.

## Goal
Reduce harm quickly and safely, maintain an evidence-driven operational picture, coordinate responders, verify recovery, and transition unresolved work to accountable owners.

## Inputs
- Initial alert/report
- Service ownership and business criticality
- Telemetry and change history
- Runbooks
- Available responders
- Approval policy

## Preconditions
- Create or confirm one incident ID.
- Name an Incident Commander.
- Establish one authoritative incident state location.

## Stages

### 1. Declare and stabilize command
**Owner:** Incident Commander  
**Actions:** record trigger/time, provisional severity, commander, communication channel, note-taker/evidence keeper, next checkpoint.  
**Output:** initialized incident state.

### 2. Triage impact and scope
**Owner:** Incident Commander + Evidence Keeper  
Use `../skills/incident-triage-and-scoping.md`.
- Separate facts/hypotheses/unknowns.
- Bound affected users, operations, data, regions, and dependencies.
- Inspect recent changes.
- Add immediate safety constraints.

**Checkpoint:** severity and impact statement reviewed.

### 3. Organize parallel investigation
**Owner:** Incident Commander  
Use `../skills/coordination-and-delegation.md`.

Parallelize only independent lanes, for example:
```text
                    ┌─ Application lane ───┐
Incident state ─────┼─ Database lane ──────┼─ Sync / consolidate
                    ├─ Infrastructure lane ┤
                    └─ Dependency lane ────┘
```
Each lane gets a bounded question, owner, expected output, checkpoint, and stop condition.

### 4. Maintain stakeholder communication
**Owner:** Communications Officer  
Use `../skills/stakeholder-communication.md`.
- Draft from verified state.
- State impact/current response/change since last update.
- Do not invent ETA or root cause.
- Request approval for public/sensitive statements.

This stage runs in parallel with technical work but consumes only consolidated facts.

### 5. Evaluate mitigation candidates
**Owner:** Incident Commander + Risk and Recovery Reviewer  
Use `../skills/recovery-and-risk-decision.md`.
- Compare expected benefit, confidence, time, blast radius, reversibility, data/security risk, and approval requirement.
- Define success metric, observation window, and rollback criteria before execution.

### 6. Approval gate
If the action changes production or is destructive/irreversible/sensitive, obtain explicit accountable human approval.

**Failure path:** if approval is unavailable, choose a safer containment option or escalate. Do not silently exceed authority.

### 7. Execute authorized mitigation
**Owner:** designated human/operator or explicitly authorized automation.  
**Incident Commander responsibility:** record actor, command/change reference, start/end timestamps, expected signal, and rollback plan.

### 8. Observe and verify
**Owner:** Risk and Recovery Reviewer + Evidence Keeper  
Compare predetermined signals before/after action.
Classify: `successful`, `partially-effective`, `ineffective`, `harmful`.

- Harmful → rollback/abort when safe, increase escalation if needed.
- Ineffective → update hypotheses; do not repeat without new evidence.
- Partial → quantify remaining impact and decide next bounded action.

### 9. Synchronize and reprioritize
At each checkpoint:
1. Update facts and impact.
2. Close falsified/stale hypotheses.
3. Merge duplicate work.
4. Resolve blockers and ownership gaps.
5. Re-rank tasks by safety, impact reduction, dependency unblock value, urgency, reversibility, and evidence gain.
6. Update severity if evidence warrants it.
7. Set the next checkpoint.

### 10. Confirm recovery
Recovery requires relevant evidence over an observation window, not one green signal. Check user-facing success, errors, latency, queues, data correctness, dependencies, synthetics, and customer reports as applicable.

### 11. Close active response / transition
Use `post-incident-transition.md`.
Document residual risks, temporary mitigations, unresolved root cause, follow-up owners, and communication closure.

## Dependencies
- Public communication depends on verified facts and required approval.
- Production mitigation depends on risk review and approval policy.
- Recovery declaration depends on verification evidence.
- Post-incident transition depends on stable ownership of remaining work.

## Retry policy
- Tool/API read failures: at most 2 immediate retries when clearly transient, then use an alternate evidence path or record the blind spot.
- Mitigation execution: never automatically retry a production-changing action unless its idempotency and retry policy are explicitly known.
- Failed verification: investigate the discrepancy; do not retry until green.

## Escalation
Escalate when:
- impact is increasing faster than response capacity;
- required ownership or production permission is unavailable;
- security/data/legal implications emerge;
- vendor dependency blocks recovery;
- responder capacity is insufficient;
- no safe mitigation exists.

## Definition of Done
- Impact is controlled or explicitly accepted by the accountable owner.
- Recovery evidence passes the closure checklist.
- Residual risks and temporary mitigations are documented.
- Follow-up work has owners and due/checkpoint dates.
- Required final communication is complete.
- Timeline and decisions are sufficiently preserved for review.