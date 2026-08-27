# Transaction and Rollback Rules

## Purpose
Limit outage duration and preserve recoverability when automated changes fail.

## Scope
Candidate configuration, commit-confirmed mechanisms, checkpoints, rollback artifacts, and multi-device changes.

## MUST
- Production mutations MUST have a tested recovery strategy appropriate to the platform and failure mode.
- Native transactional or confirmed-commit mechanisms MUST be used when available and suitable.
- Rollback data MUST be captured before changes that cannot be reconstructed reliably from source intent.
- Multi-device workflows MUST define behavior for partial commit and unreachable targets.
- Rollback execution MUST verify restoration of required service invariants.

## MUST NOT
- MUST NOT label a procedure rollback-safe unless recovery has been validated for the relevant change class.
- MUST NOT depend exclusively on the same failed management path when an outage can sever that path.
- MUST NOT automatically roll back when rollback itself would predictably worsen safety without an explicit decision rule.

## SHOULD
- Recovery SHOULD prefer forward correction when it is safer and faster than restoring obsolete state.
- Rollback artifacts SHOULD have controlled retention and access.

## Exceptions
Irreversible changes require explicit human approval, impact analysis, contingency plan, and evidence that safer alternatives were considered.

## Verification
Test failure injection, partial commits, management-path loss, rollback timers, checkpoint restoration, and post-recovery control/data-plane validation.