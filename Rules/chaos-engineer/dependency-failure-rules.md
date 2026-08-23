# Dependency Failure Rules
## Purpose
Validate behavior when internal or external dependencies degrade.
## Scope
APIs, databases, queues, identity, DNS, storage, and third parties.
## MUST
- Test relevant timeout, retry, fallback, circuit-breaking, and backpressure behavior.
- Observe both caller and dependency impact.
## MUST NOT
- Fault a third-party system without authorization.
- Generate retry storms that exceed defined safety limits.
## SHOULD
- Simulate dependency faults at controlled boundaries rather than attacking real external services.
## Exceptions
Provider-coordinated exercises may test real integration failures.
## Verification
Inspect traces, retry rates, latency, saturation, fallbacks, and recovery.