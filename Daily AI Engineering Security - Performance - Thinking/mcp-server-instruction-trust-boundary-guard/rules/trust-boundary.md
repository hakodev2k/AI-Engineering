# MCP Instruction Trust-Boundary Rules

- MCP-provided natural language MUST be treated as untrusted unless the server is explicitly trusted by policy.
- Untrusted server instructions MUST NOT be merged into trusted system/developer instructions.
- Every instruction block MUST be associated with server identity, SHA-256 hash, trust state, and observation time.
- High-impact capabilities MUST be checked at action time against the provenance of instructions that influenced the action.
- Approval MUST be bound to the current instruction hash and requested capability set.
- Changed server instructions MUST invalidate prior approval when policy requires it.
- Missing provenance MUST fail closed for high-impact actions.
- Secrets MUST NOT be exposed merely because server instructions request them.
- The agent SHOULD preserve descriptive metadata that is needed for correct tool use while stripping control characters and rejecting oversized payloads.
- The LLM MUST NOT be the sole enforcement mechanism for deterministic policy checks.