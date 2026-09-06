# Production Change Safety Rules

## Purpose
Control high-risk GPU performance changes and preserve human authority over production-impacting actions.

## Scope
Production deployments, driver/runtime changes, firmware, clocks, power limits, topology changes, large dependency upgrades, and rollback.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Production deployment, driver/runtime upgrade, firmware change, power-limit change, security-control weakening, and destructive infrastructure action MUST require explicit human approval.
- High-impact performance changes MUST include rollback criteria and post-change verification.
- Production changes MUST be small enough to attribute regressions where practical.
- Changes affecting model correctness, availability, or public service objectives MUST include validation evidence before rollout.

## MUST NOT
- MUST NOT disable safety or security controls merely to improve benchmark numbers.
- MUST NOT force push or rewrite repository history to bypass review.
- MUST NOT apply undocumented tuning flags directly in production.
- MUST NOT silently exceed granted operational authority.

## SHOULD
- SHOULD use canary or progressive rollout for material runtime and kernel changes.
- SHOULD separate benchmark experiments from persistent production configuration.

## Exceptions
Emergency actions require incident authority, minimized blast radius, auditability, and post-event review.

## Verification
Inspect approvals, diffs, deployment records, configuration history, rollback evidence, and post-change performance and correctness checks.