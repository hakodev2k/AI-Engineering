# Workflow: New System Design

## Trigger
A new service/system/platform or a major greenfield capability requires architecture.

## Goal
Deliver an implementable, reviewable design with justified decisions and verification plan.

## Inputs
Objective, requirements, constraints, current ecosystem, NFRs, security/compliance context, timeline.

## Stages
1. **Intake — Coordinator:** establish objective, scope, decision owner, deadlines.
2. **Requirement analysis — Requirement Analyst:** build requirement/NFR baseline.
3. **Checkpoint A:** block if critical contradictions or authority gaps remain.
4. **Option design — Coordinator:** create boundaries, flows, options, ADR candidates.
5. **Parallel review:** Security Reviewer, Reliability Reviewer, Cost & Performance Reviewer work from the same frozen design baseline.
6. **Synchronization:** coordinator consolidates findings and resolves conflicts by requirements, evidence, risk, and authority.
7. **Detailed design:** interfaces, data, failure handling, observability, deployment, migration, rollback.
8. **Review point:** architecture review skill + final checklist.
9. **Approval:** obtain explicit human decisions where required.
10. **Verification plan:** define tests, telemetry, experiments, and acceptance thresholds.
11. **Delivery:** publish design and handoff action items with owners.

## Parallelism
Specialist reviews may run concurrently after the option baseline is stable. Requirement clarification that can change boundaries blocks those reviews.

## Retry policy
Two fix/review cycles maximum. Persistent blocker escalates.

## Failure path
If an assumption invalidates the selected option, return to option design; do not cosmetically patch the document.

## Definition of Done
All README DoD conditions plus no blocking finding and a named owner for implementation/review follow-ups.