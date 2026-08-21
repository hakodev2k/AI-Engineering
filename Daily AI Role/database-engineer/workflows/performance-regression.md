# Workflow: Performance Regression

## Goal
Identify the causal workload/database change and restore acceptable performance without introducing hidden correctness or write regressions.

## Stages
1. Define regression window and user impact.
2. Capture baseline and current comparable telemetry.
3. In parallel: Workload Analyst compares query/plans/waits; Incident Investigator checks blocking/capacity/replication.
4. Synchronize evidence; primary agent ranks hypotheses.
5. Test least-invasive candidate in representative environment or controlled production path.
6. Review side effects and rollback.
7. Obtain approval if production-changing.
8. Apply one material variable at a time when possible.
9. Database Verifier compares before/after and neighboring workload.

## Stop conditions
Measured objective met; or evidence shows bottleneck outside database scope; or bounded investigation cannot distinguish hypotheses and escalation is required.

## Retry
Two hypothesis-test cycles maximum without new evidence before escalation/reframing.