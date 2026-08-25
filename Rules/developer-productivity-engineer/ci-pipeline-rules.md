# CI Pipeline Rules
## Purpose
Make continuous integration trustworthy, fast, and safe.
## Scope
PR validation, merge gates, CI workers, artifacts, and pipeline configuration.
## MUST
- Required checks MUST map to explicit merge risks and fail closed for critical validation.
- CI jobs MUST use least-privilege credentials and isolate untrusted code from sensitive secrets.
- Flaky failures MUST be tracked separately from deterministic product failures.
- Pipeline changes MUST preserve a diagnosable path from failure to logs and artifacts.
## MUST NOT
- MUST NOT bypass required checks merely to improve throughput metrics.
- MUST NOT expose secrets in logs, artifacts, caches, or fork-triggered jobs.
## SHOULD
- Fast deterministic checks SHOULD run before expensive suites.
## Exceptions
Emergency bypasses require authorized approval, recorded reason, compensating validation, and follow-up.
## Verification
Inspect branch protection, job permissions, failure artifacts, flake history, and PR-to-green latency.