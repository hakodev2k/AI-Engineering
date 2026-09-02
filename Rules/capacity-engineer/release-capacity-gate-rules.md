# Release Capacity Gate

## Purpose
Prevent releases, launches, and migrations from introducing unreviewed capacity risk.

## Scope
Applies to production releases that can materially change demand, resource efficiency, topology, concurrency, data volume, or dependency load.

## MUST
- Capacity-impacting releases MUST state expected change in workload and resource demand.
- Major launches and migrations MUST demonstrate sufficient headroom for expected and stress scenarios before execution.
- Material performance regressions MUST block capacity approval unless risk is explicitly accepted by accountable owners.
- Rollback or mitigation actions MUST be defined when a release could exhaust capacity rapidly.

## MUST NOT
- MUST NOT treat functional correctness as evidence of capacity readiness.
- MUST NOT approve a launch based solely on infrastructure count when workload efficiency has changed.
- MUST NOT bypass capacity review for a high-risk release merely because autoscaling exists.

## SHOULD
- Compare representative before/after load-test or production-canary evidence.
- Stage large demand shifts when progressive exposure is feasible.

## Exceptions
Exceptions require documented business need, quantified risk, monitoring, rollback criteria, and human approval.

## Verification
Review release plans, benchmark deltas, headroom dashboards, rollout controls, capacity forecasts, and rollback procedures.
