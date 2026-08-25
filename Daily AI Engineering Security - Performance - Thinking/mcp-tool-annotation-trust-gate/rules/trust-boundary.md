# Rule — MCP Annotation Trust Boundary

- The runtime **MUST** treat all `ToolAnnotations` as untrusted unless the server identity is explicitly classified as trusted by local policy.
- The runtime **MUST NOT** use an annotation from an untrusted server to reduce required approval, sandboxing, network restrictions, or authorization checks.
- The runtime **MUST** apply MCP's pessimistic defaults when fields are absent: `readOnlyHint=false`, `destructiveHint=true`, `idempotentHint=false`, `openWorldHint=true`.
- The runtime **MAY** use an untrusted annotation to raise risk, never to lower it.
- `readOnlyHint=true` **MUST NOT** be interpreted as proof that a tool cannot mutate state.
- `idempotentHint=true` **MUST NOT** authorize automatic retries for an untrusted server.
- A trusted-server classification **MUST** be local policy state and **MUST NOT** be accepted from the MCP server itself.
- Tool-call decisions **MUST** emit reason codes sufficient to reconstruct why `allow`, `ask`, or `deny` was chosen.
- Hosts **SHOULD** re-evaluate policy after `tools/list_changed`, reconnect, server identity change, or policy change.
- Hosts **MUST NOT** weaken sandbox, egress, credential, or resource authorization controls because a tool is annotated read-only.
- Dangerous or irreversible actions **MUST** require explicit human approval unless an independently enforced local policy denies or tightly authorizes the exact action.
