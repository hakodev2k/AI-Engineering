# MCP Retry Rules

- The host MUST NOT retry a method that returned JSON-RPC `-32601 Method not found` for the same server capability epoch.
- The host MUST treat advertised capabilities as authoritative until initialization is repeated or server identity/version changes.
- The host MUST maintain separate retry policy for transient transport failures, configuration/authentication failures, and unsupported protocol methods.
- Transient retries MUST use exponential backoff with jitter and MUST stop after 4 attempts per refresh cycle.
- Unknown failures MUST receive at most one diagnostic retry before escalation.
- Concurrent refresh requests for the same server/method SHOULD be coalesced into one in-flight operation.
- Circuit-breaker state MUST include server identity and capability epoch so legitimate upgrades can be reprobed.
- Retry loops MUST expose attempt count, failure class, next retry timestamp, and breaker state in structured diagnostics.
- An idle host MUST have a measurable quiescence target; repeated discovery traffic after the retry budget is exhausted is a failure.
- The system MUST NOT suppress authentication, permission, or configuration errors as if they were unsupported optional capabilities.
- Recovery MUST NOT disable security checks or skip required MCP capabilities silently.
- Completion MUST be blocked when regression tests show an unbounded retry path.