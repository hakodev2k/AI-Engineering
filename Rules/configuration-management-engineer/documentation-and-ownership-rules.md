# Documentation and Ownership

## Purpose
Ensure configuration semantics and operational responsibility remain understandable over time.

## Scope
Configuration keys, domains, templates, runbooks, ownership metadata, and lifecycle documentation.

## MUST
- Material configuration domains MUST have a named owning team or role.
- Non-obvious settings MUST document semantics, units, valid range, default behavior, and operational impact.
- Dangerous settings MUST identify required approval and recovery considerations.
- Runbooks MUST cover common configuration failure and rollback paths for critical systems.
- Documentation MUST be updated when semantics or operational procedures materially change.

## MUST NOT
- A setting MUST NOT depend on tribal knowledge for safe production use.
- Ownership MUST NOT point only to an individual when durable team ownership is available.
- Documentation MUST NOT include plaintext secrets or sensitive values as examples.

## SHOULD
- Generate reference documentation from schemas where practical.
- Link settings to relevant service objectives, policies, or architecture decisions.

## Exceptions
Self-evident low-risk settings may rely on schema descriptions rather than separate prose documentation.

## Verification
Sample configuration domains and verify owner resolution, semantic documentation, runbooks, and approval requirements. Compare recent behavior changes with documentation diffs to detect stale guidance.