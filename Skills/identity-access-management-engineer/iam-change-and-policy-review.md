# IAM Change and Policy Review

## Purpose
Review identity configuration and policy changes with the rigor appropriate to a security control plane, preventing lockouts, privilege escalation, hidden bypasses, and unreviewed trust expansion.

## When to use
Use before changes to authentication, federation, conditional access, privileged roles, provisioning, entitlement mappings, token policy, recovery, or directory synchronization.

## Inputs
Change proposal, current and target configuration, affected populations, dependencies, test evidence, rollout plan, rollback plan, and risk assessment.

## Context to inspect
Inspect policy precedence, exclusions, privileged users, service identities, emergency access, federation scope, effective permissions, lifecycle impact, telemetry, and concurrent changes.

## Core knowledge
IAM changes can have tenant-wide blast radius. Senior review evaluates both security regression and availability/recovery. Configuration diffs must be interpreted as effective policy, not merely text changes.

## Procedure
1. Clarify intended outcome and affected security boundary.
2. Compare current and proposed effective behavior.
3. Identify privileged, service, and emergency identities affected.
4. Check for expanded trust, weaker authentication, or broader grants.
5. Validate lifecycle and deprovisioning impact.
6. Review test evidence including negative cases.
7. Require staged rollout for broad-impact policy where feasible.
8. Validate monitoring and rollback/recovery.
9. Record residual risks and approvals.
10. Verify production behavior after deployment.

## Decision points
Use peer approval for routine bounded changes; require stronger security/change authority for tenant-wide trust, privileged-access, or irreversible changes. Emergency changes still require retrospective review.

## Common failure patterns
Reviewing syntax only, ignoring exclusions, no negative tests, no break-glass validation, simultaneous broad policy changes, rollback that restores insecure configuration, and assuming successful deployment means correct behavior.

## Verification
Compare post-change effective policy and representative access outcomes to the approved intent; inspect telemetry for unexpected denies or grants.

## Expected output
A reviewed IAM change with explicit risk assessment, test evidence, rollout/rollback controls, approval, and post-change verification.

## Stop conditions
Stop when effective impact cannot be determined, rollback is unsafe, emergency access is unverified, or the change exceeds reviewer authority.