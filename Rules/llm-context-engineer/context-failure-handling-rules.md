# Context Failure Handling Rules

## Purpose
Define safe, observable behavior when context sources or assembly stages fail.

## Scope
Retrieval failures, parsing failures, unavailable sources, timeouts, malformed data, and partial context.

## MUST
- Every production context dependency MUST define failure behavior appropriate to its importance.
- Required-source failure MUST be distinguishable from an intentionally empty result.
- Partial context MUST be labeled when missing evidence can affect correctness.
- Retries MUST be bounded and MUST avoid duplicate side effects.
- Failures MUST preserve diagnostic metadata sufficient for investigation.

## MUST NOT
- MUST NOT silently replace required evidence with fabricated or unrelated content.
- MUST NOT convert parsing failures into valid-looking empty content.
- MUST NOT retry indefinitely.

## SHOULD
- Prefer graceful degradation when the task remains safe and useful without the failed source.
- Record recurring failure patterns for remediation.

## Exceptions
Exceptions require documented fallback semantics and validation.

## Verification
Test dependency outages, malformed inputs, timeouts, partial results, and retry behavior.