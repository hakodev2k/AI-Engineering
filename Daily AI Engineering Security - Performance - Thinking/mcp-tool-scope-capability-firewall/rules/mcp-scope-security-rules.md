# Rules: MCP Tool Scope Security

- Every security-relevant MCP tool invocation MUST pass a deterministic host-side scope check before execution.
- Policy MUST come from a trusted source outside model-controlled context.
- Unknown tools, operations, or required target attributes MUST be denied by default.
- The firewall MUST normalize targets before policy matching.
- Filesystem checks MUST compare resolved paths against resolved allowed roots; lexical prefix checks alone MUST NOT be treated as sufficient.
- Repository policies MUST constrain repository identity and SHOULD constrain branch/environment for write operations.
- Network tools MUST validate normalized hostname against explicit policy and MUST NOT authorize solely from a URL string prefix.
- High-impact writes MUST require explicit approval when policy marks them approval-required.
- Approval MUST be bound to the normalized tool, operation, and target; generic prior approval MUST NOT authorize a different target.
- The agent/model MUST NOT modify, broaden, or disable its own capability policy.
- The firewall MUST NOT expose secrets in denial logs.
- The firewall MUST NOT replace OAuth/RBAC, sandboxing, server-side authorization, or repository protections.
- Policy changes SHOULD use independent review and adversarial tests.
- A security improvement MUST be verified by blocked attack fixtures, not inferred from prompt wording.
