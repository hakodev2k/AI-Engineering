# Rules: Tool Policy Invariants

- The runtime **MUST** preserve the distinction between a missing allowlist and an explicitly supplied empty allowlist.
- Under this package policy, an explicit empty allowlist **MUST** resolve to zero allowed tools.
- A filtered empty tool set **MUST NOT** trigger a fallback that restores a broader default tool set.
- Deny rules **MUST** be applied after allow rules and **MUST** remain effective at execution time.
- Provider-visible tools **MUST** be a subset of the normalized allowed set.
- Model-triggerable runtime tools **MUST** be a subset of the normalized allowed set.
- A tool excluded from the provider-visible schema **MUST NOT** remain model-triggerable through a secondary dispatcher, sandbox helper, subagent, or alternate execution mode.
- Interactive, batch, subagent, and sandbox paths **MUST** enforce the same normalized policy unless a narrower mode-specific policy is explicitly documented.
- Authorization **MUST NOT** rely solely on model instructions or tool descriptions.
- Unknown tool names, unresolved precedence, failed policy lookup, or malformed policy input **MUST** fail closed when they could otherwise broaden access.
- High-impact tools **MUST** be revalidated at action time by an execution component independent of model reasoning.
- Policy hot reload **MUST** invalidate stale effective-tool snapshots before accepting new high-impact actions.
- Security remediation **MUST NOT** weaken a declared restriction merely to preserve compatibility.
- Tests **SHOULD** include explicit-empty, absent, deny-only, mode mismatch, subagent, and registry-refresh cases.
