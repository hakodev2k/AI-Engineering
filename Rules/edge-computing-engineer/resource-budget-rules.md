# Resource Budgets
## Purpose
Keep workloads within constrained CPU, memory, storage, accelerator, thermal, and power envelopes.
## Scope
All software deployed to constrained edge nodes.
## MUST
- Workloads MUST define resource requests or expected envelopes appropriate to the platform.
- Memory, storage, and CPU behavior MUST be measured under representative peak conditions.
- Exhaustion behavior MUST fail safely and remain observable.
## MUST NOT
- MUST NOT depend on unbounded queues, caches, logs, or temporary files.
- MUST NOT claim capacity from development-machine measurements alone.
## SHOULD
- Resource budgets SHOULD include degradation headroom and coexistence with system services.
## Exceptions
Temporary budget exceedance requires bounded duration, impact analysis, monitoring, and approval where production risk is material.
## Verification
Use profiling, stress tests, disk-fill tests, runtime limits, thermal/power telemetry, and fleet metrics.