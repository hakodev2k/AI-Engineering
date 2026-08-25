# Deployment and Update Rules
## Purpose
Prevent software and firmware rollout from creating fleet-wide unsafe or unrecoverable behavior.
## Scope
Robot software, firmware, configuration, staged rollout, rollback, and compatibility.
## MUST
- Verify artifact identity, integrity, compatibility, and required migrations before activation.
- Use staged rollout and health gates for consequential changes when fleet architecture permits.
- Define rollback or safe recovery before production deployment.
- Require authorized human approval before production deployment that can materially affect physical behavior or safety.
## MUST NOT
- Deploy untested artifacts directly to an entire fleet.
- Make irreversible updates without explicit risk acceptance and recovery strategy.
## SHOULD
- Preserve previous known-good artifacts and configuration until new versions meet acceptance criteria.
## Exceptions
Emergency rollout requires incident authority, bounded scope, explicit monitoring, and retrospective verification.
## Verification
Inspect artifact hashes, CI evidence, compatibility checks, rollout records, health metrics, approval records, and rollback drills.