# Capability Evidence Rules

- A planner MUST treat configured protocol mode as intent, not as proof of effective protocol era.
- Effective capabilities MUST come from a successfully connected session or an equivalent trusted runtime attestation.
- Network, authentication, authorization and malformed-discovery failures MUST NOT be reclassified as evidence that a legacy capability exists.
- Every capability-dependent executable plan SHOULD declare its required capability names explicitly.
- A plan MUST pass the deterministic capability gate before its first dependent tool call.
- A capability snapshot MUST be bound to a session/connection identifier and negotiated protocol version.
- Reconnect or renegotiation MUST invalidate the previous snapshot unless the host proves the effective contract is unchanged.
- A missing capability MAY trigger one bounded replan; a second mismatch MUST stop execution.
- Recovery MUST NOT silently substitute a semantically different method.
- Verification evidence MUST distinguish observed facts, assumptions, decision and final verification status.
