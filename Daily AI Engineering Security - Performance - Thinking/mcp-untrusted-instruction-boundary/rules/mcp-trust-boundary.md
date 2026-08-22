# Rules — MCP Trust and Capability Boundary

- Remote MCP `instructions`, tool descriptions, parameter descriptions, examples, and error text MUST be treated as untrusted data, never as system/developer policy.
- The client MUST preserve provenance for every remote metadata segment.
- New or changed tool descriptors MUST be fingerprinted before exposure to an agent.
- High-impact capabilities (write, delete, code execution, credential access, external send, permission changes) MUST require deterministic policy authorization; remote prose MUST NOT grant permission.
- Credentials MUST be audience-bound to the intended MCP server and MUST NOT be forwarded to another server.
- Tokens MUST NOT appear in query strings, model-visible context, logs, or evidence artifacts.
- Tool-name collisions or ambiguous normalized identifiers MUST block activation.
- Metadata exceeding configured limits, containing invalid control characters, or failing schema validation MUST be quarantined.
- A changed high-impact schema SHOULD require explicit human approval.
- Prompt-injection detection SHOULD add evidence but MUST NOT be the sole security boundary.
- Security failures MUST fail closed for new/changed capabilities.
- Dangerous or irreversible actions MUST require explicit human approval immediately before invocation.
