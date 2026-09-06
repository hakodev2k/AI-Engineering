# Rollback and Recovery Rules

## Purpose
Ensure production model changes can be reversed quickly and safely when correctness, compatibility, or operational issues occur.

## Scope
Production aliases, deployment references, retained model versions, rollback criteria, and recovery procedures.

## MUST
- Every production model change MUST preserve a known-good rollback target for the required recovery window.
- Rollback procedures MUST identify the exact immutable model version and required runtime assets.
- Production alias changes MUST record previous and new targets.
- Rollback readiness MUST be tested for critical model services before relying on it during incidents.
- Recovery verification MUST include representative inference or service-health evidence.

## MUST NOT
- MUST NOT delete the previous production version before the rollback window closes.
- MUST NOT call a rollback complete merely because an alias changed.
- MUST NOT roll back to a version with incompatible dependencies or known critical defects.

## SHOULD
- Prefer one-step or automated rollback paths with explicit authorization.
- Keep rollback evidence close to deployment records.

## Exceptions
Exceptions require documented alternative recovery strategy, risk, and approval.

## Verification
Inspect alias history, retained artifacts, rollback drills, deployment manifests, and post-rollback validation evidence.