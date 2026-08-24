# Statistics and Plan Stability Rules

## Purpose
Keep optimizer decisions reliable as data distributions, parameters, and workloads change.

## Scope
Optimizer statistics, plan caching, parameter sensitivity, recompilation, hints, and plan regression controls.

## MUST
- Plan regressions MUST be diagnosed with plan and runtime evidence from representative parameter/data conditions.
- Statistics maintenance decisions MUST consider modification rate, distribution, table size, and engine behavior.
- Plan-forcing or hinting mechanisms MUST have documented rationale, scope, monitoring, and removal criteria.
- Parameter-sensitive workloads MUST be tested across materially different selectivity cases.

## MUST NOT
- MUST NOT clear global plan caches or force plans in production as an unreviewed troubleshooting shortcut.
- MUST NOT assume one captured plan represents all relevant parameter distributions.
- MUST NOT update statistics indiscriminately without considering workload impact.

## SHOULD
- Prefer correcting data/model/query causes before permanent plan forcing.
- Track known critical-query baselines where supported.

## Exceptions
Emergency plan controls require bounded scope, approval, rollback, and follow-up root-cause work.

## Verification
Compare plans and runtime metrics across parameters and data distributions; inspect statistics age/quality; monitor regressions after deployment; confirm forced controls remain necessary.