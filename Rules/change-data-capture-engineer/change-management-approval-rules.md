# Change Management and Approval Rules

## Purpose
Control high-risk CDC actions and keep automated agents within authorized boundaries.

## Scope
Production execution, source configuration, log retention, checkpoint overrides, destructive actions, and access changes.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Production deployments, checkpoint overrides, destructive cleanup, source-log retention reductions, and high-risk access changes MUST require explicit human approval.
- Changes MUST define expected impact, verification, and rollback or stop criteria.
- Irreversible actions MUST include recovery evidence or documented acceptance of irreversibility.
- Emergency actions MUST leave an auditable record.

## MUST NOT
- MUST NOT force advancement past unknown source ranges to restore health indicators.
- MUST NOT delete retained logs, topics, checkpoints, or schema history required for recovery without approval.
- MUST NOT weaken security controls merely to unblock capture.
- MUST NOT silently exceed granted operational authority.

## SHOULD
- Prefer reversible, narrowly scoped changes.
- Use peer review for correctness-sensitive configuration.

## Exceptions
Incident authority may expedite approval but does not remove audit, verification, or blast-radius requirements.

## Verification
Inspect approvals, diffs, audit logs, rollback plans, post-change checks, and incident records.