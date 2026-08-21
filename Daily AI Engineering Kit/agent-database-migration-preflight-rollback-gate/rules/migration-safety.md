# Migration Safety Rules

## MUST
- Identify the target environment and database engine before planning.
- Classify every schema/data operation in the migration plan.
- Run the deterministic gate after every material plan change.
- Use explicit lock and statement timeouts.
- Require batching for large backfills according to policy.
- Require measurable post-migration verification.
- Preserve the exact approved plan artifact and environment.
- Require explicit human approval for operations reported by the gate as approval-required.
- Require a separately reviewed recovery strategy for production changes.

## MUST NOT
- Execute production migrations from the planning or verification agents.
- Treat a generated migration, successful build, or static gate as proof that production rollout is safe.
- Execute a plan with gate status `blocked` or `approval_required` without the required approval.
- Modify policy, environment labels, timeout values, estimates, or operation types to evade a finding.
- Automatically widen database permissions.
- Run destructive production operations when policy blocks them.
- Perform unbounded backfills or destructive recovery actions automatically.
- Reuse approval after a material plan change.
- Claim recovery succeeded before post-recovery verification.

## SHOULD
- Prefer expand/contract for rolling deployments and backward-compatible schema evolution.
- Prefer online/concurrent index mechanisms when supported and verified for the target engine.
- Separate schema rollout, application rollout, data backfill, and contract cleanup into independently verifiable stages.
- Preserve migration logs, schema snapshots, row counts, timing, and monitoring evidence without secrets or unnecessary sensitive data.
