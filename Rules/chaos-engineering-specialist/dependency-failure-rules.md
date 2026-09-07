# Dependency Failure Rules

## Purpose
Validate system behavior when upstream, downstream, or shared dependencies become slow, unavailable, inconsistent, or capacity constrained.

## Scope
Applies to databases, queues, caches, APIs, identity systems, DNS, storage, control planes, and third-party dependencies.

## MUST
- Dependency experiments MUST identify expected fallback, timeout, retry, circuit-breaking, and degradation behavior where applicable.
- Tests MUST distinguish total outage from partial failure, latency, throttling, and intermittent errors when those modes have different consequences.
- Retry amplification and downstream load MUST be observed during dependency degradation.
- Shared dependencies MUST be mapped to affected consumers before production injection.

## MUST NOT
- Dependency health MUST NOT be inferred solely from the caller's success rate.
- Faults MUST NOT intentionally violate third-party terms or affect external systems without authorization.
- Retries MUST NOT be increased during an experiment without evaluating amplification risk.

## SHOULD
- Critical dependency experiments SHOULD validate graceful degradation and bounded resource consumption.
- Failure tests SHOULD include recovery and reconnection behavior.

## Exceptions
Omitted failure modes require documented irrelevance or risk-based justification.

## Verification
Review dependency maps, timeout and retry settings, telemetry, fallback evidence, load patterns, and recovery behavior.