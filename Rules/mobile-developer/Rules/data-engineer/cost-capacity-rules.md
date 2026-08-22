# Cost and Capacity Rules
## Purpose
Keep data workloads economically sustainable while meeting reliability and performance requirements.
## Scope
Compute, storage, transfer, retention, concurrency, and workload scaling.
## MUST
- Material cost changes MUST be supported by usage or workload evidence.
- Critical pipelines MUST define capacity assumptions and saturation risks.
- Retention and storage growth MUST be reviewed against business and governance requirements.
- Optimization MUST preserve correctness, recoverability, and required freshness.
## MUST NOT
- MUST NOT reduce redundancy, retention, or validation controls solely to lower cost without risk approval.
- MUST NOT claim savings without before/after cost evidence.
## SHOULD
- Prefer workload scheduling, pruning, compaction, right-sizing, and incremental processing before unnecessary scale-up.
## Exceptions
Temporary over-provisioning is acceptable during migration or incidents when scope and expiry are documented.
## Verification
Inspect billing data, utilization metrics, storage growth, workload benchmarks, and capacity forecasts.