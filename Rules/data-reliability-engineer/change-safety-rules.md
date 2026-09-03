# Change Safety Rules

## Purpose
Reduce production risk from pipeline, schema, infrastructure, configuration, and dependency changes.

## Scope
Production releases, configuration changes, dependency upgrades, orchestration changes, infrastructure changes, and data migrations.

## MUST
- Assess blast radius, reversibility, data compatibility, and rollback or roll-forward strategy before material production changes.
- Require human approval before destructive migrations, production data deletion, major access changes, irreversible rewrites, or controls that weaken security.
- Validate changes in representative non-production conditions when practical.
- Define post-deployment checks that verify both system health and data correctness.
- Pause or roll back when predefined failure criteria are met.

## MUST NOT
- Treat successful deployment as proof that data remains correct.
- Combine multiple high-risk changes when independent rollout would materially improve diagnosis or rollback.
- Force changes through production merely to bypass review or safety controls.
- Rewrite Git history or force push as part of routine production recovery.

## SHOULD
- Prefer incremental, observable, and reversible rollout patterns.
- Separate schema introduction, code adoption, and schema removal when compatibility risk exists.

## Exceptions
Emergency changes require accountable approval, bounded scope, evidence collection, rollback criteria, and retrospective verification.

## Verification
Review diffs, migration plans, approvals, tests, deployment records, rollback readiness, post-deployment quality checks, and incident signals.