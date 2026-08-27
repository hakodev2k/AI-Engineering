# Rules: MCP Retry and Health
- Every lifecycle failure MUST be classified before retry or terminal failure.
- HTTP 5xx and configured transport timeouts MAY be retried only within `max_attempts`.
- Authentication, authorization, invalid configuration, and protocol incompatibility MUST NOT be blindly retried.
- A stdio server MUST NOT be declared dead solely from a stale handle if a health probe or OS/process evidence shows it is alive.
- Confirmed process death MUST stop retries unless an explicit restart policy exists outside this package.
- Backoff MUST be bounded.
- Retry count and time-to-ready MUST be measured.
- A single transient initialization failure MUST NOT be cached as a permanent session failure when retry budget remains.
- Recovery logic MUST NOT auto-approve privileged tools.
