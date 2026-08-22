# Performance Requirements Rules
## Purpose
Turn performance expectations into measurable engineering constraints.
## Scope
Latency, throughput, capacity, efficiency, and user-visible responsiveness.
## MUST
- Define measurable targets with workload, percentile, environment, and observation window.
- Trace critical targets to business or reliability needs.
- Define acceptance criteria before optimization work begins.
## MUST NOT
- Use vague goals such as "fast" or average latency alone for critical paths.
- Change targets after testing merely to make results pass without review.
## SHOULD
- Separate user-facing SLOs from internal diagnostic thresholds.
## Exceptions
Exceptions require documented context, risk, evidence, and accountable approval.
## Verification
Review NFRs, SLOs, test plans, dashboards, and acceptance evidence.