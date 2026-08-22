# Threat Model — MCP Discovery Instruction Injection Firewall

## Scope
This threat model covers MCP host/client handling of natural-language server instructions received during discovery/initialization, especially when those instructions can enter model context or be cached and reused.

## Assets
- System/developer instructions and their precedence.
- User intent and approval decisions.
- Credentials, secrets, private repository data, mail/calendar/document content.
- Tool permissions and authorization tokens.
- Repository and production write capability.
- Integrity of model planning and tool selection.
- Cache integrity and tenant/session isolation.
- Security audit records.

## Trust boundaries
1. **Trusted host policy** — deterministic code/config controlled by the client owner.
2. **Model context boundary** — model-visible content is not itself an enforcement boundary.
3. **Remote MCP server boundary** — all server-provided natural language is untrusted unless a separately verified administrative trust relationship exists.
4. **Tool execution boundary** — sensitive effects require host authorization independent of model preference.
5. **Cache boundary** — cache reuse must never silently broaden the audience of untrusted instructions.
6. **Human approval boundary** — approvals must occur before sensitive side effects and must show source/risk/effect information.

## Threat actors
- Malicious MCP server operator.
- Compromised legitimate MCP server.
- Supply-chain attacker modifying an MCP package or server image.
- Tenant attempting to poison a shared cache.
- External content author whose text is surfaced by an MCP server.
- Accidental misconfiguration that marks an untrusted server as trusted.

## Primary attack path
1. Host connects to an MCP server.
2. Server returns natural-language discovery instructions.
3. Client inserts those instructions into a high-authority prompt/context or allows them to steer planning.
4. Instructions attempt to override policy, request secret access, suppress confirmation, or drive an exfiltrating/destructive tool.
5. If discovery metadata is shared through a public/shared cache, another session may inherit the poisoned text.
6. Model behavior changes even though the host never explicitly granted the instruction authority.

## Security invariants
- Remote instruction text is data, never authority.
- Raw remote instructions never enter a system/developer instruction channel.
- Trust labels come from host administration, not the remote server itself.
- Sensitive tool authorization cannot be granted by model output or remote text.
- Tainted context remains tainted until the host deliberately starts a clean execution context; summarization does not clear taint.
- Untrusted discovery instructions are never placed in public/shared caches by default.
- Audit events store hashes/reason codes by default, not raw potentially secret-bearing payloads.
- Malformed/oversized instruction text fails closed.

## Threat matrix

| Threat | Preconditions | Impact | Deterministic control | Residual risk |
|---|---|---|---|---|
| Direct instruction override | Remote text reaches model | Wrong planning/tool calls | Guard + untrusted data envelope | Novel text may evade heuristic scoring, but has no authority |
| Secret exfiltration directive | Secret-reading + egress tools available | Confidentiality loss | Sensitive-tool policy + approval + network controls | User may approve a misleading action |
| Destructive action steering | Write/destructive tool available | Integrity/availability loss | Taint-aware approval gate | Social engineering of approver |
| Shared cache poisoning | Cross-user cache reuse | Multi-user compromise | No public cache for untrusted instructions; trust-scoped cache keys | Misconfigured downstream proxy |
| Annotation spoofing | Host trusts server hints | Wrong risk classification | Treat annotations as hints only; host policy is authoritative | Admin trust misclassification |
| Unicode/control-character obfuscation | Guard accepts hidden chars | Detection bypass | Strict UTF-8, NFKC normalization, control-char rejection | Unicode confusables still possible |
| Oversized prompt stuffing | No limits | Token/latency DoS, context displacement | Byte/character limits | Distributed multi-field stuffing outside this component |
| Audit data leakage | Raw payload logging | Secret persistence | Hash/reason-code logging | Operators can explicitly enable unsafe logging elsewhere |

## Taint model
### Sources that set taint
- Remote discovery/initialize instructions from an untrusted or unknown server.
- Tool output from an open-world/untrusted source when fed into the same decision path.
- Cache entries lacking a verified server/trust/policy identity.

### Taint propagation
Taint follows derived plans, summaries, and decisions that consumed tainted content. It is metadata held by the host, not prose inserted into the model.

### Taint sinks
A tainted path cannot automatically execute:
- network egress carrying sensitive data;
- repository mutation;
- production-impacting actions;
- permission/identity changes;
- secret-bearing reads followed by open-world writes;
- destructive tools.

Such operations require deterministic deny or explicit human approval according to policy.

## Approval requirements
Approval UI/event should include:
- MCP server identity and administrative trust classification;
- whether tainted instructions influenced the plan;
- requested tool/action and target;
- sensitive-data classes involved;
- network/open-world destination when applicable;
- reason codes from the guard;
- whether the action is destructive/reversible/idempotent.

Approval must not expose hidden secrets merely to explain the risk.

## Cache rules
- Default: no shared/public caching for untrusted instruction payloads.
- If local caching is required, key by server identity, tenant/workspace, trust classification, protocol version, policy version, and normalized payload hash.
- Changing trust or policy invalidates prior instruction cache entries.
- Cache lookup failures or identity mismatch result in refetch/revalidation, not permissive fallback.

## Detection and response
Detect via guard decisions, repeated suspicious reason codes, trust changes, approval escalations, and cache-key mismatches. On repeated blocks from one server: disable that server for the current execution context, preserve minimal audit evidence, require administrator review before re-enabling, and rotate credentials if tool/token exposure is suspected.

## Non-goals
- Proving that an LLM can never be manipulated by adversarial text.
- Treating heuristic phrase detection as a complete prompt-injection classifier.
- Replacing sandboxing, network egress policy, authentication, authorization, or secret-management systems.

## Definition of a blocked attack path
An attack is considered blocked when attacker-controlled discovery instructions cannot acquire trusted instruction authority and cannot cause a sensitive side effect without an independent host policy decision or explicit human approval.