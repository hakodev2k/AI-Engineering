# Fallback and Resilience Rules
## Purpose
Keep AI features predictable during model, provider, retrieval, or tool failures.
## Scope
Timeouts, retries, fallbacks, degraded modes, provider outages, and partial failures.
## MUST
- Define failure modes and acceptable degraded behavior for production workflows.
- Bound retries by attempt, time, and cost budgets and use backoff where appropriate.
- Ensure fallback models or providers preserve required safety and authorization controls.
- Make partial or degraded results explicit when they may affect user decisions.
## MUST NOT
- Retry non-idempotent side effects blindly.
- Fail over to an unapproved provider or weaker security posture silently.
## SHOULD
- Test provider outage, timeout, malformed response, quota, and dependency-failure scenarios.
## Exceptions
Emergency fallbacks require documented scope, risk, monitoring, and approval where security or data handling changes.
## Verification
Run fault-injection tests and inspect timeout, retry, fallback, and degraded-mode metrics.