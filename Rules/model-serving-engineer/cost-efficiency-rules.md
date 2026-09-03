# Cost Efficiency Rules

## Purpose
Control serving cost without trading away required reliability, latency, or quality.

## Scope
Applies to accelerator selection, replica sizing, utilization, batching, caching, and model/runtime choices.

## MUST
- Measure cost against meaningful workload units such as requests or generated tokens.
- Evaluate cost changes together with latency, throughput, error rate, and quality constraints.
- Identify idle and stranded accelerator capacity using production evidence.
- Validate hardware or runtime migrations with comparable workload benchmarks before broad rollout.

## MUST NOT
- Claim a cost optimization from list price alone when utilization or performance differs materially.
- Reduce redundancy below approved availability requirements merely to lower cost.
- Move sensitive workloads to lower-cost infrastructure without required security and compliance review.

## SHOULD
- Prefer efficiency gains that improve both utilization and operational simplicity.
- Track cost regressions by model version and serving configuration.

## Exceptions
Temporary cost-risk trade-offs require documented business rationale, measurable limits, owner, expiry, and approval.

## Verification
Review billing and utilization data, benchmark comparisons, capacity reports, SLO dashboards, and architecture decisions.