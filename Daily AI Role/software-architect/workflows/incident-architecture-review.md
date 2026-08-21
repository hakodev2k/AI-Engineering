# Workflow: Incident Architecture Review

## Trigger
A production incident reveals a systemic design, dependency, capacity, recovery, or operability weakness.

## Goal
Convert verified incident evidence into architecture improvements without speculative redesign.

## Preconditions
Immediate incident response remains owned by incident/SRE operations. This workflow starts once enough evidence exists for architectural analysis.

## Stages
1. Gather timeline, symptoms, impact, telemetry, mitigations, and known root-cause evidence.
2. Separate proximate failure, contributing conditions, detection/recovery gaps, and unknowns.
3. Map failure propagation and architecture assumptions that were violated.
4. Run reliability review; add security or cost/performance review only if implicated.
5. Generate remediation options: containment, resilience, observability, capacity, contract, or dependency changes.
6. Rank actions by recurrence risk, impact, effort, and reversibility.
7. Record ADRs for durable design changes.
8. Define verification such as load/failure test, alert test, recovery rehearsal, or reconciliation.
9. Track owners and deadlines; do not mark complete from document publication alone.

## Parallelism
Evidence collection and independent subsystem analysis may run concurrently; root-cause conclusions must synchronize before permanent remediation is selected.

## Retry/stop
Do not optimize based on one unexplained anomaly. If root cause remains uncertain after two evidence cycles, record hypotheses and escalate further investigation.

## Definition of Done
Architecture-related causes/conditions are evidenced, corrective actions are owned, prevention is verifiable, and residual risk is accepted by the correct owner.