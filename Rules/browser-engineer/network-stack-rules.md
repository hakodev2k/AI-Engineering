# Network Stack Rules
## Purpose
Preserve protocol correctness, privacy, security, and predictable failure handling in browser networking.
## Scope
HTTP-family protocols, connection management, proxies, DNS integration, redirects, caching, and fetch plumbing.
## MUST
- Protocol parsing MUST validate attacker-controlled framing, lengths, states, and limits.
- Requests MUST preserve origin, credential, privacy, and policy semantics across redirects and retries.
- Timeout and cancellation behavior MUST release resources predictably.
## MUST NOT
- MUST NOT retry non-idempotent operations automatically unless semantics explicitly permit it.
- MUST NOT bypass certificate, mixed-content, or policy checks for convenience.
## SHOULD
- SHOULD bound queues, buffers, retries, and concurrent connections.
## Exceptions
Protocol deviations require interoperability evidence and security review.
## Verification
Use protocol conformance tests, malformed-input fuzzing, proxy tests, cancellation tests, network traces, and interoperability suites.