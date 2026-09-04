# Security Failure Containment Rules

## Purpose
Limit blast radius when agent inputs, tools, credentials, policies, or dependencies are suspected to be compromised or manipulated.

## Scope
Applies to prompt injection, tool injection, credential compromise, authorization anomalies, malicious retrieved content, sandbox escape indicators, and security-control failures.

## MUST
- Tool access MUST follow least privilege for the specific workflow and execution context.
- Untrusted content MUST remain data and MUST NOT gain authority to override trusted system, policy, or approval instructions.
- Tool arguments that affect security boundaries or external state MUST be validated before execution.
- Code execution and high-risk tools MUST be isolated or sandboxed where practical for the threat model.
- Suspected credential compromise or unauthorized tool behavior MUST trigger containment, revocation or suspension of affected authority, and escalation.
- Security failures MUST fail closed when continued execution could expose data, broaden access, or create harmful side effects.
- Blast radius MUST be bounded by tenant, user, environment, resource, and permission scope wherever those boundaries exist.

## MUST NOT
- Secrets, credentials, or authentication tokens MUST NOT be exposed in prompts, logs, traces, or tool output beyond the minimum protected mechanism required.
- Instructions found in retrieved, user-supplied, or tool-returned content MUST NOT be treated as trusted control instructions merely because they are well-formed.
- Security controls MUST NOT be weakened during an incident without explicit authorized approval.

## SHOULD
- Sensitive tools SHOULD support rapid disablement independently of the whole agent platform.
- Security anomalies SHOULD produce structured telemetry suitable for investigation and correlation.

## Exceptions
Exceptions require explicit threat-model justification, compensating controls, bounded exposure, security review, and accountable approval.

## Verification
Run prompt-injection and tool-injection tests, permission-boundary tests, secret scanning, sandbox escape simulations where applicable, credential-revocation tests, and fail-closed dependency scenarios.