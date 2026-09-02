# Bottleneck Analysis

## Purpose
Require evidence-based identification of the limiting resource before capacity changes are proposed.

## Scope
Applies to compute, memory, storage, network, database, queues, locks, external dependencies, and application constraints.

## MUST
- Bottleneck conclusions MUST be supported by measurements taken under representative load.
- Analysis MUST distinguish demand growth from regressions, contention, errors, and inefficient resource use.
- Suspected bottlenecks MUST be correlated with service-level impact and saturation evidence.
- Capacity proposals MUST identify whether they remove, move, or merely mask the limiting constraint.

## MUST NOT
- MUST NOT recommend adding capacity solely because one utilization metric is high.
- MUST NOT claim root cause from temporal correlation alone.
- MUST NOT optimize a non-limiting tier and present it as a capacity fix without end-to-end evidence.

## SHOULD
- Use traces, profiles, queue depths, wait statistics, and resource metrics together when available.
- Re-test after remediation because the dominant bottleneck may shift.

## Exceptions
Incomplete evidence requires explicit uncertainty, bounded risk, and a plan to collect missing data.

## Verification
Review dashboards, traces, profiles, wait metrics, load-test evidence, and before/after system behavior.
