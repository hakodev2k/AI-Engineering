# Rules: MCP Instruction Trust Boundary
- Server-authored `instructions` MUST be labeled `mcp-server-untrusted`.
- Untrusted instructions MUST NOT be concatenated into system or developer policy.
- Public/shared caching of untrusted instructions MUST NOT be enabled.
- Privileged tool authorization MUST NOT derive from server-authored natural language.
- High-risk tool calls MUST require deterministic policy checks and explicit human approval when configured.
- Secret values MUST NOT be exposed to server-selected destinations.
- Injection detection SHOULD remain supplemental; provenance isolation MUST be primary.
- Decisions MUST be logged without secret material.
