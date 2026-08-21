# Skill: Incident Command

## Purpose
Restore service safely while coordinating investigation, mitigation, communication, and evidence.

## Trigger
Production degradation, outage, data-risk event, dependency failure, or severe operational anomaly.

## Inputs
Alerts, user reports, deployment timeline, dashboards, logs/traces, dependency status, runbooks, recent changes.

## Procedure
1. Establish incident commander and severity; state known impact and start time.
2. Freeze unrelated high-risk changes when appropriate.
3. Split work: evidence gathering, mitigation execution, communications, and dependency investigation may proceed in parallel with distinct owners.
4. Build a timeline using facts; mark hypotheses explicitly.
5. Prefer reversible mitigations: rollback, traffic shift, feature disable, rate limiting, failover, capacity relief.
6. For each action record expected effect, risk, owner, approval requirement, execution time, and observed result.
7. Reassess severity after each material state change.
8. Verify recovery through critical user journey plus service and dependency telemetry.
9. Maintain a monitored stabilization period before closure.
10. Create follow-up items for root cause, detection gaps, resilience, and toil.

## Constraints
No destructive or irreversible action without explicit approval. No unbounded diagnostic loops.

## Outputs
Incident timeline, impact statement, mitigations, evidence, recovery proof, handoff/follow-ups.

## Verification
Recovery evidence must include user-visible success plus normalized relevant SLIs/saturation.

## Failure Handling
If mitigation fails twice or risk grows, stop repeating it; escalate and choose a different strategy.

## Stop Conditions
Close only when service is stable, impact has ended, residual risk is owned, and follow-up is recorded.