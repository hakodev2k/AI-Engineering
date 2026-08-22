# Capability Freshness Rules

- The client MUST distinguish transport health from capability freshness.
- A `connected` transport MUST NOT be treated as proof that the model-visible tool catalog is current.
- The client MUST compute a deterministic fingerprint from normalized tool definitions when freshness matters.
- Tool ordering MUST NOT affect the normalized catalog fingerprint.
- A `list_changed` notification MUST trigger a bounded refresh path when the server declares that capability.
- Reconnect, authorization-scope change, and explicit server-generation change MUST invalidate freshness even if the server name is unchanged.
- The implementation MUST follow `tools/list` pagination to completion before declaring a catalog fresh.
- The implementation MUST NOT cache solely by server display name when a stronger identity or content fingerprint is available.
- Schema changes MUST be treated as capability changes even when the tool name is unchanged.
- Mutating tool calls MUST NOT be used as freshness probes.
- A detected authoritative/visible catalog mismatch MUST block calls to changed or missing tools until refreshed or explicitly approved by a human fallback.
- Refresh retries MUST be bounded to two network attempts.
- The system SHOULD measure refresh latency, stale-call count, restart count, and catalog mismatch rate.
- The system MUST NOT log bearer tokens or raw credentials while tracking authorization changes; use a non-secret scope/identity fingerprint.
- Performance improvement MUST be demonstrated against a baseline rather than inferred from fewer manual steps.