# Performance Regression Rules
## Purpose
Detect and prevent material performance degradation during change.
## Scope
CI benchmarks, release comparison, production trends, and dependency upgrades.
## MUST
- Define regression thresholds for critical workloads with noise tolerance.
- Compare material changes against an appropriate baseline.
- Investigate regressions before release or explicitly accept documented risk.
## MUST NOT
- Ignore repeatable regressions because functional tests pass.
- Fail builds on noisy benchmarks without controlling variance sufficiently.
## SHOULD
- Track benchmark history and correlate shifts with code, runtime, infrastructure, or dependency changes.
## Exceptions
Approved regressions require business rationale, measured impact, owner, and follow-up where needed.
## Verification
Inspect benchmark history, CI results, release comparisons, production trends, and approvals.