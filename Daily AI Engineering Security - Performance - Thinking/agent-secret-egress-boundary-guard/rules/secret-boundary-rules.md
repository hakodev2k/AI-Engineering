# Secret Boundary Rules

- Raw credentials MUST NOT be placed in model prompts, model-visible tool output, conversation history, or reasoning artifacts when an opaque reference can be used.
- Credential resolution MUST occur at the narrowest approved execution sink.
- Every secret resolution MUST be bound to the active tenant/profile identity and requested capability.
- A child process MUST receive an explicit environment allowlist; it MUST NOT inherit the full parent environment by default.
- Provider-bound, log-bound, transcript-bound, and artifact-bound payloads MUST be checked for registered secret values before persistence or transmission.
- The guard MUST use exact registered values or deterministic taint/fingerprint metadata in addition to format-based patterns.
- The system MUST NOT rely on prompt instructions as the only secret-protection mechanism.
- Tool-specific scrubbing SHOULD be backed by one central egress policy to prevent inconsistent bypasses.
- Secret values MUST NOT appear in diagnostic messages; diagnostics MAY include label, byte length, source, sink, and a non-reversible fingerprint.
- Cross-profile secret resolution MUST fail closed when profile identity is missing or ambiguous.
- Network tools MUST NOT receive credentials unrelated to the target destination/action.
- Any detected registered-secret egress MUST block completion and MUST NOT be downgraded to a warning.
- Security testing MUST use synthetic canary secrets whenever possible.
- Credential rotation or revocation MUST require an authorized human or existing operational policy; autonomous agents MUST NOT rotate production credentials merely to hide a failed test.
- Retries MUST be bounded to two attempts and MUST NOT relax scanning, sandboxing, identity, or approval requirements.