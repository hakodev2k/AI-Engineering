# Rollback Safety Rules

## MUST

- Produce a rollback-readiness assessment before any high-risk change is approved for execution.
- Record the exact changed files, detected risk categories, rollback procedure, rollback owner, verification command, and known data-loss risk.
- Treat database migrations, production configuration, security controls, infrastructure, and data transformations as approval-required categories.
- Preserve evidence from failed verification attempts before retrying.
- Stop after at most two retries for the same failed verification condition.
- Use the smallest reversible change that satisfies the requirement.
- Verify rollback instructions against the actual repository, deployment method, migration tooling, and environment assumptions.
- Distinguish rollback of code, configuration, schema, and data; do not assume one rollback mechanism covers all four.
- Require an independent verifier for high-risk changes.
- Mark unresolved uncertainty explicitly as a blocking risk when it could make rollback unsafe.

## MUST NOT

- Do not execute production deployment, schema changes, destructive SQL, infrastructure changes, secret changes, force pushes, irreversible migrations, or production configuration changes without explicit human approval.
- Do not claim a rollback is safe merely because `git revert` is possible.
- Do not delete data, rewrite Git history, disable security controls, or broaden permissions to make rollback easier.
- Do not hide partial rollback behavior or data-loss risk.
- Do not retry until success.
- Do not let the implementing agent be the sole verifier for high-risk work.
- Do not treat a passing build as proof that rollback is operationally safe.

## SHOULD

- Prefer additive migrations and backward-compatible contracts when possible.
- Prefer feature flags, staged rollout, canaries, or dual-read/write transitions for risky behavior changes.
- Test rollback in a non-production environment when the deployment model allows it.
- Capture pre-change baselines that can be compared after rollback.
- Keep rollback procedures deterministic and copy-pasteable.
- Document conditions where rollback must be replaced by forward-fix because rollback would worsen data integrity.
