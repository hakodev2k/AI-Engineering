# Source Control Hardening

## Purpose
Protect authoritative source and release metadata from unauthorized or insufficiently reviewed changes.

## When to use
Use when configuring repositories, reviewing governance, onboarding automation, or investigating suspicious commits.

## Inputs
Repository settings, branch rules, identities, teams, apps, deploy keys, webhook configuration, audit logs, and release process.

## Context to inspect
Inspect default and release branches, CODEOWNERS, merge rules, administrators, bots, tokens, SSH keys, signed commits/tags, and emergency bypasses.

## Core knowledge
Source control is a high-value integrity boundary. Least privilege, strong authentication, protected branches, independent review, immutable audit trails, and constrained automation reduce compromise paths.

## Procedure
1. Identify authoritative branches, tags, and repositories.
2. Inventory human and machine write access.
3. Require strong authentication and remove stale identities.
4. Protect critical branches from direct pushes and force updates.
5. Require appropriate review and status checks.
6. Protect security-sensitive paths with ownership rules.
7. Restrict app, webhook, deploy-key, and token permissions.
8. Define controlled administrator bypass with auditability.
9. Monitor changes to repository security settings.
10. Test that prohibited mutations actually fail.

## Decision points
Use stronger review for release/security-critical paths without making routine work unusable. Commit signing can add evidence but does not replace account security or branch enforcement.

## Common failure patterns
Administrators exempt from controls by default; broad bot tokens; stale collaborators; mutable release tags; CODEOWNERS without enforced review; trusting signed commits from compromised accounts.

## Verification
Attempt representative direct pushes, unauthorized approvals, tag rewrites, and protected-path changes. Confirm controls and audit events behave as designed.

## Expected output
A hardened repository trust boundary with least privilege and enforceable change governance.

## Stop conditions
Escalate on unexplained privileged access, suspected account compromise, missing audit capability, or required controls unavailable on the hosting tier.