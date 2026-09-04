# GPU Maintenance and Upgrade Rules

## Purpose
Control maintenance, firmware, driver, host, and hardware changes without creating avoidable fleet-wide outages or workload loss.

## Scope
Applies to planned maintenance, node draining, component replacement, firmware and operating-system upgrades, and accelerator generation transitions.

## MUST
- Maintenance MUST define affected capacity, workload impact, drain strategy, validation criteria, rollback or containment, and responsible owner.
- Nodes MUST be drained or otherwise protected from new work before disruptive maintenance unless the procedure is explicitly online-safe.
- Upgrade rollouts MUST progress through representative canaries before broad fleet adoption.
- Post-maintenance validation MUST include device health, topology, network, storage, scheduler visibility, and representative GPU workload execution.
- Capacity headroom MUST be assessed before taking substantial accelerator pools offline.

## MUST NOT
- A successful host boot MUST NOT be treated as sufficient post-maintenance GPU validation.
- Fleet-wide upgrades MUST NOT proceed after unexplained canary regressions.
- Hardware replacement MUST NOT lose asset, firmware, or failure-history traceability.

## SHOULD
- Maintenance SHOULD be reversible where technology permits.
- Large changes SHOULD be segmented by failure domain and hardware generation.

## Exceptions
Exceptions require urgency, documented risk, compensating validation, bounded blast radius, and approval.

## Verification
Inspect maintenance plans, drain events, canary evidence, capacity forecasts, version inventories, diagnostics, workload tests, and rollback records.