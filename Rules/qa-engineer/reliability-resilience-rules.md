# Reliability and Resilience Rules
## Purpose
Verify systems fail predictably and recover without unacceptable data or service impact.
## Scope
Timeouts, retries, dependency failures, partial outages, restart, recovery, and degraded modes.
## MUST
- Test material dependency failures, timeouts, retry behavior, duplicate delivery, and recovery paths where applicable.
- Verify data consistency and user-visible outcomes after interrupted operations.
- Capture evidence that distinguishes transient failure from permanent corruption.
## MUST NOT
- Assume retry automatically improves reliability without testing duplication and amplification risks.
- Inject failures into production without authorized controls.
## SHOULD
- Include recovery objectives and degraded-mode expectations in critical-system verification.
## Exceptions
Failure injection may use controlled simulations when real dependency disruption is unsafe.
## Verification
Review resilience scenarios, recovery evidence, logs/traces, data checks, and operational expectations.