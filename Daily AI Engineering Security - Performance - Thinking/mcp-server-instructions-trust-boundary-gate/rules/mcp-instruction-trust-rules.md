# MCP Instruction Trust Rules

- Server-provided `instructions`, tool descriptions, annotations, titles, and tool output MUST be treated as untrusted data unless explicit host trust policy says otherwise.
- Untrusted server text MUST NOT be concatenated into immutable system/developer policy as if it were host-authored instruction.
- The host MUST preserve origin/provenance for server-controlled metadata through prompt assembly and tool authorization.
- Unknown server trust MUST default to untrusted.
- Server metadata MUST NOT grant new filesystem, network, repository, secret, or production permissions.
- Tool annotations such as `readOnlyHint`, `destructiveHint`, `idempotentHint`, or `openWorldHint` MUST NOT override host-side capability classification or approval policy.
- Privileged or side-effecting tool calls MUST be authorized against user intent and host policy independently of model-generated rationale.
- Untrusted instructions requesting policy override, hidden actions, secret access, approval bypass, or external data transmission MUST be blocked or escalated according to policy.
- Metadata MUST be size-limited and control characters normalized before model exposure.
- Security logs SHOULD record server origin, trust state, metadata hash, requested capability, authorization verdict, approval identity when applicable, and executed action without recording plaintext secrets.
- Injection classification MAY inform risk scoring but MUST NOT be the sole enforcement control.
- High-risk changes MUST be verified by an agent/person other than the implementer.
- Failed security tests MUST block completion; security thresholds MUST NOT be weakened merely to achieve compatibility or performance.
