# Config Trust Boundary Rules

- Project/repository configuration MUST be treated as untrusted until repository identity and config hash are approved by a trusted local principal.
- A lower-trust configuration source MUST NOT increase executable capability, network reach, filesystem reach, credential access, tool registration, autonomous mode, approval bypass, or model instruction authority.
- Security-sensitive merges MUST use tightening-only semantics by default.
- A repository file MUST NOT enable shell, arbitrary-code execution, MCP/STDIO processes, deployment tools, package installation, credential access, or unrestricted network access without explicit approval.
- Approval MUST bind repository identity, source path, requested capability delta, config digest, approving principal, and expiry/revocation condition.
- Changing any approved security-sensitive config bytes MUST invalidate the prior approval.
- Nested repository or worktree config MUST be evaluated independently; parent trust MUST NOT automatically propagate.
- Project instructions MUST NOT be interpreted as authorization to cross permission boundaries.
- Tool registration SHOULD occur only after the effective-policy check succeeds.
- Unknown security-sensitive fields MUST fail closed when they can plausibly affect capability.
- The checker MUST emit machine-readable evidence describing baseline policy, candidate policy, deltas, trust source, decision and blocking reason.
- Human approval MUST be required before dangerous or irreversible capability escalation.
- Failure to parse policy, resolve repository identity, or validate an approval artifact MUST block escalation rather than silently falling back to permissive behavior.
