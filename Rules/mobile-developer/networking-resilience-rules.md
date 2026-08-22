# Networking Resilience Rules
## Purpose
Make mobile network communication bounded, efficient, and safe under unreliable conditions.
## Scope
HTTP/RPC clients, retries, timeouts, cancellation, connectivity changes, and transport failures.
## MUST
- Network calls MUST have bounded timeouts and cancellation behavior appropriate to user intent.
- Retries MUST be limited, back off, and consider idempotency and server guidance.
- Transport, protocol, authentication, validation, and business errors MUST remain distinguishable.
## MUST NOT
- Non-idempotent requests MUST NOT be blindly retried.
- Infinite retry loops MUST NOT consume battery or radio resources.
## SHOULD
- Clients SHOULD coalesce redundant requests and avoid unnecessary radio wakeups.
## Exceptions
Long-lived streaming connections may use different timeout semantics with explicit reconnect policy.
## Verification
Test timeout, cancellation, DNS failure, server errors, throttling, duplicate responses, and network switching.