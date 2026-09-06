# Capacity and Scalability Rules
## Purpose
Prevent production launches that fail under realistic demand or growth.
## Scope
Compute, storage, databases, queues, caches, network dependencies, quotas, and third-party limits.
## MUST
- Capacity assumptions MUST be based on a documented workload model.
- Critical bottlenecks, quotas, and saturation points MUST be identified before launch.
- Capacity validation MUST include expected peak demand and an agreed growth or burst margin.
- Scaling behavior MUST be validated where the design depends on automatic or manual scaling.
- External service quotas and rate limits MUST be included in readiness analysis.
## MUST NOT
- Average traffic MUST NOT be the sole capacity basis for bursty systems.
- Horizontal scalability MUST NOT be assumed when a stateful or shared bottleneck has not been tested.
- Capacity claims MUST NOT be based only on local development results.
## SHOULD
- Use load, stress, soak, and saturation testing according to risk.
- Track headroom and define conditions that trigger capacity action.
## Exceptions
Where representative testing is impractical, use conservative modeling, guardrails, reduced rollout scope, and approval.
## Verification
Inspect workload models, benchmark results, scaling tests, quota inventories, dashboards, and capacity calculations.