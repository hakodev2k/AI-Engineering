# OTA Updates
## Purpose
Deliver software and firmware updates without compromising fleet integrity or availability.
## Scope
Remote updates to edge nodes.
## MUST
- Update artifacts MUST be authenticated and integrity-verified before activation.
- Rollouts MUST be staged with health gates and a defined rollback or recovery path.
- Compatibility requirements and minimum supported versions MUST be explicit.
## MUST NOT
- MUST NOT execute unsigned or unverifiable update artifacts.
- MUST NOT perform fleet-wide high-risk rollout without progressive validation and human approval.
## SHOULD
- Updates SHOULD support resumable transfer and power-loss-safe activation.
## Exceptions
Emergency rollout acceleration requires documented incident context, monitoring, rollback readiness, and approval.
## Verification
Inspect signatures, rollout policy, canary results, failure injection, rollback tests, and fleet version inventory.