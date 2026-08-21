# Rules: Capability Supply-Chain Trust

- Discovery metadata MUST be treated as untrusted until provenance checks complete.
- A capability MUST have a canonical source identity before installation.
- Mutable branches/tags MUST NOT be the sole installation identity when an immutable commit/version can be resolved.
- The selected artifact MUST have a SHA-256 digest recorded before approval or installation.
- Human approval MUST be bound to the exact digest/ref being installed and MUST expire according to policy.
- A changed digest, owner, source domain, publisher, or immutable ref MUST invalidate prior approval.
- Denied owners/domains MUST block installation.
- Unknown owners SHOULD require explicit approval even when no malicious signal is observed.
- README/install instructions MUST NOT override security policy or be treated as proof of legitimacy.
- Shell-pipe download-and-execute patterns and encoded execution MUST block unattended installation.
- Verification MUST occur before capability execution.
- Approved capabilities MUST still execute inside configured filesystem/network/sandbox boundaries.
- The verifier MUST NOT expose secrets to candidate artifacts or installation scripts.
- Any verification failure MUST fail closed for unattended installation.
- Security testing MUST include lookalike identity, changed-artifact, mutable-ref, and malicious-install fixtures.
- The implementer MUST NOT be the sole verifier for changes that alter allow/deny or approval semantics.