# Real-Time Scoring Rules

## Purpose
Keep online fraud decisions available, bounded in latency, and safe under dependency failure.

## Scope
Synchronous scoring services, feature retrieval, model inference, and decision dependencies.

## MUST
- Real-time scoring MUST have explicit latency, availability, and timeout budgets.
- Dependency failures MUST produce predefined fail-open, fail-closed, challenge, or fallback behavior based on risk.
- Scoring requests MUST be idempotent where retries can occur.
- Production scoring MUST expose version and decision trace identifiers.

## MUST NOT
- MUST NOT allow unbounded retries or waits in a customer-facing decision path.
- MUST NOT default to the highest-risk action merely because telemetry is unavailable unless explicitly approved.

## SHOULD
- Critical dependencies SHOULD have graceful degradation and load-shedding plans.
- Scoring paths SHOULD minimize unnecessary network calls.

## Exceptions
Riskier fallback modes require documented threat assumptions, approval, and expiry/review.

## Verification
Use load tests, fault injection, latency percentiles, timeout configuration review, retry tests, and decision-trace inspection.