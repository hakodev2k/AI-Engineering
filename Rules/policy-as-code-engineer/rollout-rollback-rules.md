# Policy Rollout and Rollback Rules

## Purpose
Limit blast radius when policy behavior changes and preserve a tested recovery path.

## Scope
Applies to policy promotion, staged rollout, canary enforcement, bundle activation, rollback, and emergency recovery.

## MUST
- Production policy changes with material decision impact MUST have a rollback strategy before activation.
- Rollouts MUST identify blast radius, affected enforcement points, expected decision changes, and stop conditions.
- Staged rollout MUST be used when a policy can safely be introduced to a subset of traffic, tenants, resources, or environments.
- Rollback artifacts and required runtime compatibility MUST be verified before high-risk rollout.
- Rollout monitoring MUST distinguish policy-caused denials, errors, latency, and enforcement failures.

## MUST NOT
- A policy rollout MUST NOT proceed after defined stop conditions are reached without explicit accountable approval.
- Rollback MUST NOT rely on reconstructing an unknown prior policy state.
- Emergency rollback MUST NOT silently remove unrelated security controls.

## SHOULD
- New restrictive controls SHOULD use observation or canary phases when immediate blocking is not required by an active threat.
- Rollout plans SHOULD include communication to owners of affected enforcement points.

## Exceptions
Immediate enforcement may bypass gradual rollout for an active security threat, but the reason, authority, affected scope, and post-change validation MUST be recorded.

## Verification
Review deployment records, immutable versions, canary results, stop conditions, monitoring evidence, and rollback exercises. Confirm the previous known-good policy can be restored within the required recovery objective.