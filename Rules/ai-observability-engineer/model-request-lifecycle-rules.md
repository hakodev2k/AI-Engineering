# Model Request Lifecycle Rules

## Purpose
Make every production model interaction observable from admission through provider response and user-visible outcome.

## Scope
Applies to model gateways, inference APIs, SDK calls, retries, fallbacks, streaming, and cancellations.

## MUST
- Each model call MUST record model/provider identifier, request start/end, outcome category, latency, retry count, and token or equivalent usage when available.
- Streaming requests MUST distinguish time-to-first-token, stream duration, completion, cancellation, and transport failure.
- Fallback model usage MUST be observable separately from primary-model success.
- Provider errors MUST be normalized into stable operational categories while preserving provider-specific diagnostic codes where safe.
- User cancellation and timeout MUST be distinguished from provider failure.

## MUST NOT
- Raw prompts or responses MUST NOT be captured by default merely for convenience.
- Retries MUST NOT be counted as independent user requests in business-level reliability metrics.
- Provider success MUST NOT be equated automatically with successful user outcome.

## SHOULD
- Capture model version, routing policy, temperature or other materially relevant generation configuration when safe.
- Correlate model calls with upstream retrieval, tool, and policy decisions.

## Exceptions
Unavailable provider metadata may be omitted only when the limitation is documented and alternate measurement exists.

## Verification
Exercise success, timeout, rate-limit, cancellation, retry, fallback, and streaming scenarios; inspect resulting traces and metrics for correct lifecycle classification.