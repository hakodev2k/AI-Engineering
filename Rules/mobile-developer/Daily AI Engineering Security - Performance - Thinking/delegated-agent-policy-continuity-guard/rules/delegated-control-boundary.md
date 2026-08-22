# Delegated Control Boundary Rules

- Every protected delegate MUST have a unique delegate identifier that is not inferred solely from the parent session identifier.
- Every protected delegation batch MUST carry a correlation ID from spawn through tool decision and parent reconciliation.
- Required security hooks MUST be runtime-attested for each supported delegation topology before high-risk work begins.
- A missing hook event, timeout, empty acknowledgement, or ambiguous identity MUST NOT be interpreted as permission.
- Child `deny` or `ask` outcomes MUST surface to the parent in structured state before the parent may report success.
- Parent orchestration MUST NOT report a fan-out as successful when any protected child operation was denied, unresolved, or invisible.
- Delegates MUST NOT perform destructive, credential-bearing, production, repository-history-changing, or permission-escalating actions when policy coverage is `unproven`.
- Canary operations MUST be harmless, deterministic, and incapable of mutating protected state.
- Policy version/hash SHOULD be included in attestation so cached attestations are invalidated after configuration changes.
- Attestations MUST expire when process topology, client version, hook configuration, or policy version changes.
- Logs MUST exclude secrets and raw credentials.
- Recovery MUST be bounded to one fresh-delegate retry; subsequent failure MUST block protected delegation rather than weaken policy.
- High-risk exceptions MUST require explicit human approval and MUST document which control could not be proven.