# Production Change Rules

## Purpose
Control graph database changes that can affect availability, integrity, security, or public behavior.

## Scope
Configuration, upgrades, schema changes, migrations, maintenance, topology, access, and operational commands.

## MUST
- Classify production changes by blast radius, reversibility, and data risk.
- Define validation, monitoring, rollback or recovery, and responsible approver before high-risk execution.
- Require human approval for destructive data operations, irreversible migrations, production deployments, privilege expansion, secret rotation, and security-control weakening.
- Prefer staged or canary changes where supported.
- Verify service and graph invariants after change completion.

## MUST NOT
- Execute a high-risk production change merely because analysis recommends it.
- Combine unrelated risky changes when independent rollback would be safer.
- Continue rollout after predefined abort criteria are met.

## SHOULD
- Schedule changes with adequate operational coverage and recovery time.
- Automate repeatable, validated procedures.

## Exceptions
Emergency changes require explicit incident authority, minimum necessary scope, contemporaneous logging, and retrospective review.

## Verification
Inspect change record, diff, approvals, prechecks, rollout telemetry, abort criteria, postchecks, and rollback/recovery evidence. Confirm the executed change matches the reviewed plan.