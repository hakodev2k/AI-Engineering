# Configuration Automation Rules

## Purpose
Make network configuration reproducible, reviewable, and safe at scale.

## Scope
Infrastructure as code, templates, scripts, controllers, APIs, and configuration pipelines.

## MUST
- Version-control intended configuration or automation source where tooling permits.
- Validate generated changes, target inventory, credentials scope, and blast radius before execution.
- Make automation idempotent or explicitly protect non-idempotent actions.
- Protect secrets through approved secret-management mechanisms.

## MUST NOT
- Embed production credentials or tokens in repositories, scripts, logs, or generated artifacts.
- Run unreviewed bulk changes across production devices without staged validation and approval.

## SHOULD
- Use linting, schema validation, dry runs, canaries, and automated postchecks.

## Exceptions
Manual configuration requires documented reason and reconciliation back to the authoritative source.

## Verification
Review repository history, pipeline controls, dry-run output, secret scanning, target selection, canary evidence, and drift checks.