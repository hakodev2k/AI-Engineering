# Performance Validation Rules
## Purpose
Require objective evidence for latency, throughput, and efficiency claims.
## Scope
Performance-critical production paths and changes with material performance risk.
## MUST
- Performance targets MUST be measurable and tied to representative workloads.
- Claimed improvements or regressions MUST be supported by before/after evidence.
- Tests MUST capture relevant percentile latency, throughput, error rate, and resource utilization.
- Material environmental variables MUST be controlled or documented.
- Critical regressions MUST block readiness unless explicitly accepted.
## MUST NOT
- Single-run benchmarks MUST NOT be treated as conclusive when variance is material.
- Mean latency MUST NOT be used alone where tail latency affects users.
- Optimization MUST NOT weaken correctness, security, or recoverability without approval.
## SHOULD
- Preserve reproducible benchmark scenarios.
- Validate test assumptions against production telemetry after controlled rollout.
## Exceptions
Document measurement limits, uncertainty, safeguards, and approval.
## Verification
Review methodology, raw results, environment details, comparisons, and production signals.