# Rules — MCP Instruction Trust Boundary

- MCP-provided instructions MUST retain server provenance through context assembly and tool execution.
- Untrusted MCP instructions MUST NOT be inserted into system/developer-authority text as trusted instructions.
- Server trust MUST come from explicit configuration; wording, popularity, or previous benign behavior MUST NOT imply trust.
- Exact instruction content MUST be SHA-256 hashed before approval or high-impact action.
- Approval for untrusted instructions MUST be bound to the current instruction hash and requested capability.
- A changed instruction hash MUST invalidate any approval when policy enables invalidation.
- High-impact capabilities MUST include at least execution, destructive write/delete, deployment/publishing, secret access, and unrestricted network egress when those capabilities exist.
- Missing provenance, malformed policy, or ambiguous capability classification MUST fail closed for high-impact actions.
- Raw instructions SHOULD be excluded from security logs when they may contain secrets; hashes and bounded metadata SHOULD be logged instead.
- Generic prompt-injection classification SHOULD be treated as additional evidence, never as the sole authorization control.
- Human approval MUST NOT authorize a broader action than the capability and instruction hash displayed for approval.
- Security verification MUST include at least one benign fixture, one malicious instruction fixture, one changed-instruction fixture, and one malformed-input fixture.
