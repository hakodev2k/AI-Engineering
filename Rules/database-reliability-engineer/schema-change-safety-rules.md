# Schema Change Safety Rules

## Purpose
Prevent schema changes from causing outages, lock amplification, or irreversible data loss.

## Scope
DDL, migrations, index changes, column changes, and compatibility transitions.

## MUST
- Assess lock behavior, table size, execution time, and rollback before production schema changes.
- Use backward-compatible expand-and-contract patterns for changes spanning application versions.
- Require backups or equivalent recovery evidence before destructive or irreversible changes.
- Define abort criteria and monitor execution in real time.

## MUST NOT
- Do not run destructive DDL in production without approved migration and recovery strategy.
- Do not combine unrelated high-risk schema changes into one execution step.

## SHOULD
- Prefer online or phased migration techniques when supported and operationally justified.

## Exceptions
Urgent changes require explicit incident or change authority, risk acceptance, and post-change review.

## Verification
Review migration plans, lock analysis, test runs, rollback procedures, monitoring, and change records.