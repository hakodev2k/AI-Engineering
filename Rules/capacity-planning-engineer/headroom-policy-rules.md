# Headroom Policy Rules
## Purpose
Maintain enough spare capacity to absorb credible variation and failures.
## Scope
Service, cluster, zone, region, and dependency headroom.
## MUST
- Headroom targets MUST derive from failure modes, provisioning lead time, demand variance, and recovery objectives.
- Critical capacity pools MUST have explicit warning and action thresholds.
- Headroom calculations MUST account for capacity unavailable during maintenance or failure.
## MUST NOT
- MUST NOT treat nominal installed capacity as fully usable capacity.
- MUST NOT reduce safety headroom solely to improve utilization without risk analysis.
## SHOULD
- Headroom SHOULD be expressed in both resource units and time-to-exhaustion where useful.
## Exceptions
Temporary reductions require owner, expiry, mitigation, and approval.
## Verification
Inspect policy thresholds, failure assumptions, dashboards, and historical saturation events.