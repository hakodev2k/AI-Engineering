# Approval Arbitration Rules

- Every privileged approval request **MUST** have a stable request ID and exactly one terminal decision.
- External approvers **MUST NOT** implicitly become the reviewer merely because a hook executed first.
- If the effective reviewer is known and is not external, the external integration **MUST** `observe` or `defer` unless explicit policy delegates it.
- If reviewer identity is unknown, an external integration **MUST NOT** auto-allow high-risk actions; it **SHOULD** defer or request bounded review.
- A `claim` **MUST** include an expiry/lease. Expired claims **MUST** release the request to the configured fallback path.
- A remote approval wait **MUST** be bounded. Timeout **MUST NOT** silently mean allow.
- A terminal `allow` or `deny` **MUST** cancel/close all competing approval surfaces.
- Late or duplicate terminal decisions **MUST** be rejected and logged.
- Cancellation **MUST** be idempotent.
- Approval policy **MUST NOT** weaken sandbox, authentication, least privilege, or required human review to improve latency.
- High-risk irreversible operations **MUST** require the configured human/security reviewer even if an automation responder is available.
- Audit records **SHOULD** contain request ID, action class, reviewer, owner, timestamps, lease expiry, decision, and reason; they **MUST NOT** contain secrets unnecessarily.
- Failure to determine a safe reviewer **MUST** fail closed or defer to the native approval path, never auto-allow.
