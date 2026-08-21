# Configuration Change Rules
## Purpose
Control database configuration changes that can alter correctness, performance, or availability.
## Scope
Engine parameters, compatibility settings, memory, parallelism, timeouts, logging, and connection limits.
## MUST
- Record the problem, baseline, proposed setting, expected effect, risk, rollback, and verification for material changes.
- Validate environment-specific limits before applying copied recommendations.
- Require human approval for production changes with material blast radius.
## MUST NOT
- Change multiple high-impact settings simultaneously when their effects cannot be isolated.
- Treat vendor defaults or internet tuning values as universally correct.
## SHOULD
- Change one causal variable at a time where practical.
## Exceptions
Incident changes may be expedited but require rollback criteria and retrospective review.
## Verification
Inspect configuration diffs, approvals, metrics, benchmarks, and post-change health.