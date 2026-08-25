# Developer Workflow Performance Rules
## Purpose
Protect feedback-loop latency with evidence-based performance budgets.
## Scope
Builds, tests, linting, code generation, checkout, IDE indexing, and CI feedback.
## MUST
- Critical workflows MUST define representative latency measurements and regression thresholds.
- Performance regressions beyond agreed budgets MUST be investigated before broad rollout.
- Optimizations MUST include before/after measurements under comparable conditions.
- Performance tests MUST separate warm-cache and cold-cache behavior where relevant.
## MUST NOT
- MUST NOT trade correctness, security, or determinism for speed without explicit risk approval.
- MUST NOT report isolated best-case timings as typical performance.
## SHOULD
- Budgets SHOULD focus on high-frequency developer interactions first.
## Exceptions
Temporary regressions require quantified impact, owner, mitigation, and target recovery date.
## Verification
Run representative benchmarks, compare distributions, inspect cache state, and track regression alerts.