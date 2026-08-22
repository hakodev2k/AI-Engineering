# Capability Approval Rules

- Every mutating tool request MUST map to a normalized capability before execution.
- Unknown high-impact capabilities MUST be denied by default.
- Equivalent effects across terminal, file, MCP, nested-agent, and custom tools MUST receive equivalent policy decisions.
- High-impact operations MUST NOT execute without approval bound to actor/session, capability, target, and argument hash.
- Approval for one tool surface MUST NOT automatically authorize an equivalent request with changed arguments or target.
- Delegated actions MUST carry provenance when policy requires it.
- Tool adapters MUST NOT bypass the central decision point by invoking side effects directly.
- Sensitive filesystem writes, process control, credential access, infrastructure mutation, and external writes MUST be centrally evaluated.
- Every allowed or denied high-impact request MUST be auditable.
- Tests SHOULD include alternate surfaces for the same requested effect.
- Policy failures MUST NOT be resolved by disabling approval or broadening allowlists without explicit security review.
