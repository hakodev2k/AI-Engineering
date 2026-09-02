# Error and Status Rules

## Purpose
Represent failures consistently so traces support diagnosis rather than inflate or hide error rates.

## Scope
Applies to span status, exception events, protocol results, cancellations, retries, and expected business outcomes.

## MUST
- Span error status MUST represent failure of the traced operation according to adopted semantic conventions.
- Unexpected exceptions MUST preserve diagnostically useful type and stack information after sensitive-data controls.
- Expected business rejections MUST be distinguished from infrastructure or application failures.
- Cancellation, timeout, and retry exhaustion MUST be distinguishable when operational handling differs.

## MUST NOT
- MUST NOT mark every non-success business outcome as an infrastructure error.
- MUST NOT suppress an unexpected exception merely because the caller retries successfully.
- MUST NOT record raw exception messages when they may contain prohibited sensitive values without sanitization.

## SHOULD
- Error classification SHOULD be stable enough for aggregation across releases.
- Repeated retry failures SHOULD avoid redundant low-value exception payloads when one causal error record is sufficient.

## Exceptions
Exceptions require protocol-specific rationale, evidence that default semantics are misleading, and review approval.

## Verification
Exercise success, expected rejection, timeout, cancellation, retry, and exception paths; compare resulting spans with application behavior and error metrics.
