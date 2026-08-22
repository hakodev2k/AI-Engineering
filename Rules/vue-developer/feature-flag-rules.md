# Feature Flag Rules

## Purpose
Use frontend feature flags as controlled release mechanisms without creating permanent complexity or security gaps.

## Scope
Remote/local flags, experiments, staged rollouts, kill switches, and conditional UI behavior.

## MUST
- Every flag MUST have an owner, purpose, expected lifetime, and removal condition.
- Security or entitlement decisions MUST remain enforced by trusted backend controls regardless of frontend flag state.
- Flagged code paths that may reach production MUST be testable in both relevant states.
- Changes to high-impact production flags MUST follow authorized operational approval and audit requirements.
- Flag evaluation failure MUST have a defined safe default.

## MUST NOT
- Frontend flags MUST NOT contain secrets or be relied upon to hide privileged functionality from unauthorized users.
- Expired flags MUST NOT remain indefinitely when they create unreachable branches or duplicated behavior.
- Experiments MUST NOT silently alter contractual or safety-critical behavior without appropriate approval.

## SHOULD
- Centralize flag access behind a typed abstraction and expose semantic flag names.
- Remove rollout flags promptly after a decision becomes permanent.

## Exceptions
Long-lived operational kill switches are valid when their ownership, testing cadence, and activation authority are explicit.

## Verification
Inspect flag inventory, test both states, simulate provider failure, verify backend enforcement, and review production flag-change audit records.