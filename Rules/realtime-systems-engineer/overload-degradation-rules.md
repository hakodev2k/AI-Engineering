# Overload and Degradation Rules

## Purpose
Keep system behavior controlled when demand exceeds provisioned capacity.

## Scope
Burst handling, shedding, admission control, degraded modes, and criticality preservation.

## MUST
- Real-time systems MUST define overload detection thresholds and the action taken when they are crossed.
- Higher-criticality deadlines MUST be protected from lower-criticality overload where architecture permits.
- Load shedding and degraded modes MUST preserve invariants and define recovery criteria.
- Overload strategies MUST be validated against credible burst and sustained-load scenarios.

## MUST NOT
- MUST NOT rely on uncontrolled queue growth as an overload strategy.
- MUST NOT silently drop critical work without explicit safety or correctness semantics.

## SHOULD
- Prefer early admission control to late deadline misses when work can be rejected safely.

## Exceptions
Exceptions require quantified capacity evidence and documented consequences of saturation.

## Verification
Use saturation tests, burst tests, queue telemetry, deadline-miss metrics, and degraded-mode acceptance tests.