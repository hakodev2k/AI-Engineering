# Upgrade and Compatibility Rules
## Purpose
Protect performance when database engines, compatibility modes, drivers, or extensions change.
## Scope
Major/minor upgrades, optimizer versions, compatibility settings, drivers, and extensions.
## MUST
- Benchmark critical workloads before and after material engine or compatibility changes.
- Review optimizer, statistics, feature, and configuration behavior that can alter plans.
- Define rollback or mitigation for unacceptable regressions before production rollout.
## MUST NOT
- Assume functional compatibility implies performance compatibility.
- Enable new optimizer behavior globally without regression evidence for critical workloads.
## SHOULD
- Use staged rollout and representative canaries where supported.
## Exceptions
Security-critical upgrades may proceed under expedited timelines with compensating performance monitoring.
## Verification
Review compatibility notes, benchmark suites, plan comparisons, staged rollout evidence, and rollback readiness.