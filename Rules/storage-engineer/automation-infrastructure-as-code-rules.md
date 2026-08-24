# Automation and Infrastructure-as-Code Rules

## Purpose
Make storage operations repeatable while preventing automation from amplifying mistakes.

## Scope
Provisioning, configuration management, scripts, IaC, orchestration, and scheduled operations.

## MUST
- Automation MUST be idempotent or explicitly detect and control repeated execution where practical.
- Destructive operations MUST require target validation and explicit authorization gates.
- Configuration code MUST be reviewed, versioned, and tested before production use.
- Automation MUST surface partial failures and preserve enough context for recovery.
- Secrets MUST come from approved secret-management mechanisms.

## MUST NOT
- MUST NOT embed credentials or private keys in scripts or repositories.
- MUST NOT use broad wildcard targeting for destructive production actions without bounded selection and confirmation.
- MUST NOT treat successful command exit as sufficient validation of storage correctness.

## SHOULD
- Provide dry-run, plan, diff, and rollback capabilities for high-impact workflows.

## Exceptions
One-off emergency scripts require peer review when feasible and post-use removal or formalization.

## Verification
Review source control, CI checks, plans/diffs, secret scans, test results, execution logs, and production safeguards.