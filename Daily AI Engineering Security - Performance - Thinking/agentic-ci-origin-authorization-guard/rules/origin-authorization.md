# Origin Authorization Rules

- Privileged workflow actions MUST authorize the originating principal, not only the immediate bot/relay actor.
- A bot comment, label, review, or command MUST NOT be treated as proof that a human or trusted principal requested the action.
- Provenance MUST include origin actor, origin association, source event type/id, relay actor, requested capability, repository/ref, and evidence hash.
- Missing, malformed, or conflicting provenance MUST fail closed.
- Privileged jobs MUST require explicit human approval when origin trust cannot be proven deterministically.
- Repository write, secret access, OIDC, deployment, release, package publication, and production mutation MUST be modeled as privileged capabilities.
- Prompt content MUST NOT override authorization policy.
- Tokens and credentials MUST use least privilege and SHOULD be issued after the authorization gate where the platform supports it.
- Authorization records MUST be immutable for the lifetime of the privileged execution and MUST be invalidated when material provenance changes.
- Implementing agents MUST NOT be the sole verifier of changes to this gate.
