# CI Feedback Rules
## Purpose
Make continuous-integration feedback trustworthy, timely, and actionable.
## Scope
Presubmit checks, pipelines, queues, status reporting, and failure diagnostics.
## MUST
- Required checks MUST correspond to defined quality or safety gates.
- CI failures MUST preserve enough evidence to reproduce or bound the cause.
- Flaky required checks MUST be tracked and remediated with an owner.
- Changes to required gates MUST assess defect-escape and developer-wait risk.
## MUST NOT
- MUST NOT normalize rerunning failures until green as a substitute for investigation.
- MUST NOT silently bypass mandatory security or release gates.
- MUST NOT claim CI speed improvement without representative measurements.
## SHOULD
- Fast deterministic checks SHOULD run before expensive checks.
- Independent checks SHOULD execute concurrently when infrastructure permits.
## Exceptions
Temporary bypasses require scope, expiry, risk, compensating verification, and authorized approval.
## Verification
Inspect gate configuration, flaky-test history, queue/runtime percentiles, failure artifacts, bypass audit logs, and defect escapes.