# Model Registry Governance Rules

## Purpose
Ensure only approved, traceable, security-reviewed models can become release candidates or production artifacts.

## Scope
Applies to model registries, artifact metadata, lifecycle states, approvals, aliases, and promotion workflows.

## MUST
- Require immutable model versions with owner, provenance, evaluation, and security-review references.
- Restrict promotion, alias reassignment, and deletion privileges according to least privilege.
- Record who promoted a model, when, from which artifact, and under which approval.
- Prevent production deployment from unapproved lifecycle states.

## MUST NOT
- Use mutable aliases as the sole evidence of artifact identity.
- Permit silent replacement of bytes beneath an existing version.
- Delete registry evidence needed for active incidents or required retention.

## SHOULD
- Enforce promotion gates automatically in CI/CD.
- Separate experiment tracking from authoritative production release records.

## Exceptions
Emergency rollback to a previously approved model may use an expedited path when artifact identity, prior approval, and rollback authorization are verified.

## Verification
Inspect registry ACLs, version immutability, lifecycle state transitions, audit logs, deployment references, and approval records.