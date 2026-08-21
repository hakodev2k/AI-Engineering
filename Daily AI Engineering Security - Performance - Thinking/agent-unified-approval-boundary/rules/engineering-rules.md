# Engineering Rules

## MUST
- Every side-effecting or open-world adapter MUST call the Unified Approval Boundary before dispatch.
- Authorization MUST be based on canonical capability + target + arguments, not transport or display tool name alone.
- Unknown capabilities, malformed policy, missing actor identity, or missing approval route MUST fail closed.
- Destructive, production, credential, identity, and permission-changing operations MUST require explicit human approval unless a stronger externally verifiable policy forbids execution entirely.
- Approval tokens MUST bind actor, parent task, capability, target, canonical argument hash and expiry.
- Approval waits MUST have a finite timeout.
- Rejected, timed-out and malformed approvals MUST prevent dispatch.
- Untrusted MCP annotations MUST be treated as hints only; they MUST NOT weaken deterministic policy.
- Every allow, deny, request, approval, timeout and dispatch MUST emit an audit event without secrets.
- Delegated agents MUST prove they have an answerable approval route before requesting an operation that requires approval.
- Registration of a new side-effecting adapter MUST fail CI until boundary mediation is declared and tested.

## MUST NOT
- MUST NOT bypass approval by wrapping a command in MCP, SSH, Docker, shell, code execution, browser automation or a subagent.
- MUST NOT interpret `readOnlyHint`, `destructiveHint: false`, model text, server instructions, or tool descriptions as authorization.
- MUST NOT mint wildcard approvals for destructive capabilities.
- MUST NOT reuse approval after arguments, target, capability, actor or parent task changes.
- MUST NOT convert approval infrastructure errors into ALLOW.
- MUST NOT wait forever for a user/guardian that cannot answer.
- MUST NOT let the implementing agent be the sole verifier of high-risk boundary changes.
- MUST NOT log raw credentials, secrets or sensitive argument bodies in audit records.

## SHOULD
- SHOULD normalize equivalent effects into a small capability vocabulary independent of tool provider.
- SHOULD prefer explicit deny/approval rules over regex-only command detection.
- SHOULD keep terminal/MCP/subagent adapters thin so policy lives in one layer.
- SHOULD surface a concise effect summary and exact target in approval UX.
- SHOULD use pessimistic defaults for unannotated tools.
- SHOULD measure approval latency and prompt frequency to detect unusable policies without weakening security.
- SHOULD retain machine-verifiable route-coverage reports in CI artifacts.
