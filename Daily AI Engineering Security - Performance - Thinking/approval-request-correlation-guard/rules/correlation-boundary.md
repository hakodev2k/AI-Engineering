# Correlation Boundary Rules

- Every approval request MUST have immutable `session_id`, `turn_id`, `request_id`, `tool_call_id`, `action_digest`, `policy_digest`, `created_at`, `expires_at`, and `nonce` fields.
- An approval response MUST NOT be accepted when any immutable binding field differs from the live pending request.
- A response MUST NOT authorize a request whose lifecycle is `cancelled`, `revoked`, `expired`, or `completed`.
- Session interruption or explicit Stop MUST revoke all non-terminal request envelopes owned by that session/turn before further mutation is allowed.
- A policy or action change after presentation MUST create a new request ID and nonce; previous approval MUST NOT carry forward.
- Reconnect/resume MUST rehydrate the live request by exact `request_id`; UI text matching alone is insufficient.
- Duplicate responses for an already terminal request MUST be idempotently rejected or acknowledged without re-executing the action.
- `expires_at` MUST be finite. Expiry MUST fail closed.
- "Approve for session" grants SHOULD be represented separately from one-shot approvals and MUST declare their scope explicitly.
- Logs MUST include correlation IDs and digests but MUST NOT contain secrets, full credentials, or sensitive command output.
- Unknown/missing fields MUST result in `review` or rejection, never implicit allow.
