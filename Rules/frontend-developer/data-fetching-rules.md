# Data Fetching Rules
## Purpose
Make remote-data interactions correct under latency, failure, retries, and navigation.
## Scope
HTTP requests, query libraries, mutations, cancellation, caching coordination, and retries.
## MUST
- Requests MUST define loading, success, empty, and failure behavior appropriate to user impact.
- Obsolete in-flight reads MUST be canceled or prevented from overwriting newer state.
- Mutations MUST define duplicate-submission and retry behavior.
- Retry policy MUST distinguish transient failures from permanent or validation failures.
- Client-visible errors MUST preserve actionable context without exposing sensitive internals.
## MUST NOT
- Non-idempotent operations MUST NOT be blindly retried.
- UI code MUST NOT assume network completion order equals request creation order.
## SHOULD
- Centralize transport concerns such as authentication, correlation, and consistent error normalization.
## Exceptions
Fire-and-forget interactions require explicit loss tolerance and observability.
## Verification
Integration tests should cover latency, cancellation, out-of-order completion, retries, and failure responses.