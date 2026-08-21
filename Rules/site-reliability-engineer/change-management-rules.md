# Change Management Rules

## Purpose
Reduce reliability risk from production changes through review, reversibility, verification, and controlled rollout.

## Scope
Applies to application, infrastructure, configuration, dependency, schema, and operational changes.

## MUST
- Production changes MUST have a clear owner, expected effect, verification plan, and rollback or forward-fix strategy.
- High-risk changes MUST receive independent review before execution.
- Change risk MUST consider blast radius, reversibility, timing, dependency state, and current error budget.
- Emergency changes MUST be documented after stabilization if normal pre-change process was shortened.

## MUST NOT
- MUST NOT combine unrelated high-risk changes solely for convenience.
- MUST NOT treat successful deployment as proof of successful change.
- MUST NOT bypass review merely because a change is operational rather than code-based.

## SHOULD
- Prefer small, independently reversible changes.
- Use staged rollout, canaries, or feature controls when they materially reduce risk.

## Exceptions
Emergency bypass requires explicit accountable approval when feasible, bounded scope, evidence, and mandatory follow-up review.

## Verification
Inspect change records, diffs, approvals, rollout telemetry, rollback readiness, and post-change validation.