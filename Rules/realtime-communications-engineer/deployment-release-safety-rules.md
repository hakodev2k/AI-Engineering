# Deployment and Release Safety Rules

## Purpose
Reduce user-visible disruption from realtime system changes.

## Scope
Client/server releases, protocol changes, media infrastructure, rollout, rollback, and compatibility.

## MUST
- Releases affecting signaling or media MUST define compatibility with clients that may remain deployed for the supported overlap window.
- High-risk changes MUST use staged rollout with health gates and rollback criteria.
- Rollback feasibility MUST be validated before production deployment when state/schema changes are involved.
- Production deployment and irreversible changes MUST require authorized human approval.

## MUST NOT
- MUST NOT deploy a breaking signaling contract to all regions simultaneously.
- MUST NOT weaken security controls merely to unblock rollout.
- MUST NOT proceed through a health gate when critical session metrics regress beyond approved bounds.

## SHOULD
- Separate protocol enablement from code deployment using reversible controls where practical.

## Exceptions
Emergency changes require incident authority, documented risk, and post-change review.

## Verification
Review rollout plans, compatibility tests, health metrics, approval records, rollback drills, and production diffs.