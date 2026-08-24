# Denial Disclosure Policy

## Enforceable rules

- The system **MUST** treat refusal, denial, safety-warning and authorization-failure text as security-sensitive output.
- User-facing denials **MUST** use a documented public reason code or a generic explanation that does not reveal protected implementation details.
- The system **MUST NOT** disclose hidden parameter names, internal route names, secret feature flags, unpublished tool identifiers, bypass conditions, disabled checks or historical protection deltas when denying a request.
- Internal diagnostics **MUST NOT** be copied verbatim into model-visible or user-visible denial text unless explicitly classified as public.
- A denial **MUST NOT** weaken the underlying authorization, connector, sandbox, network, memory or tool boundary to make the interaction more convenient.
- Protected literals and patterns **MUST** be maintained in a versioned configuration owned by the security/platform team.
- Multi-turn adversarial probes **MUST** be evaluated as a sequence, not only as independent messages.
- A release that changes guardrails, prompts, tool schemas, routing or denial rendering **MUST** run `scripts/oracle_probe_audit.py` against its regression corpus.
- Any configured protected-surface match **MUST** block release until reviewed and either removed or explicitly reclassified as public.
- Human-readable correction guidance **SHOULD** explain what the user may do next without explaining how the denied control is implemented.
- Rate limiting **SHOULD** supplement disclosure controls but **MUST NOT** be considered sufficient remediation for a leaking denial.
- The implementing engineer or agent **MUST NOT** be the only verifier for a high-risk disclosure-policy change.

## Observable evidence
A compliant release records the audit command, configuration revision, transcript/corpus identifier, exit code, violation count and independent verifier decision.