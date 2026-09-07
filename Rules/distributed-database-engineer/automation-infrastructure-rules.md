# Automation and Infrastructure Rules

## Purpose
Make database infrastructure reproducible, reviewable, and safe to operate.

## Scope
Infrastructure as code, provisioning, configuration, secrets integration, automation, and drift control.

## MUST
- Production database infrastructure and material configuration MUST be represented in auditable automation where platform capabilities allow.
- Automation MUST be idempotent or explicitly detect unsafe repeated execution.
- Destructive actions MUST require explicit intent and authorized approval.
- Configuration drift MUST be detectable.

## MUST NOT
- MUST NOT embed credentials in infrastructure definitions or automation logs.
- MUST NOT auto-apply destructive infrastructure changes based solely on generated plans.
- MUST NOT bypass review by making undocumented console changes except during authorized emergencies.

## SHOULD
- Plans SHOULD be reviewed separately from execution for material changes.

## Exceptions
Emergency manual changes require audit capture and prompt reconciliation back into managed configuration.

## Verification
Inspect infrastructure plans, CI gates, drift reports, audit logs, secret scans, and repeat-execution tests.