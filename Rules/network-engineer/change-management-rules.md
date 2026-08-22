# Network Change Management Rules

## Purpose
Reduce outage risk from configuration and topology changes.

## Scope
Production network configuration, firmware, topology, routing, security, and service changes.

## MUST
- Define intent, scope, dependencies, blast radius, validation, rollback, owner, and communication before material production changes.
- Capture current state and configuration before execution.
- Require human approval for high-risk or potentially disruptive production changes.
- Validate service behavior after change, not configuration acceptance alone.

## MUST NOT
- Execute destructive, irreversible, or broad production changes without authorized approval and recovery strategy.
- Bundle unrelated risky changes when independent rollback is practical.

## SHOULD
- Automate prechecks, diffs, backups, and postchecks.

## Exceptions
Emergency changes may abbreviate process only to restore service; authority, actions, evidence, and retrospective review remain mandatory.

## Verification
Review approved change record, config diff, backups, pre/post checks, monitoring, rollback readiness, and outcome.