# Migration and Compatibility Rules

## Purpose
Use flags to sequence migrations without creating incompatible states or irreversible data damage.

## Scope
Schema, protocol, dependency, service, and behavioral migrations controlled by flags.

## MUST
- Migration flags MUST define compatible states during mixed-version deployment.
- Irreversible writes MUST NOT begin until rollback implications are understood and approved.
- Expand-and-contract migrations MUST preserve compatibility for the required deployment window.
- Data migration progress and reconciliation MUST be observable when flags control read/write paths.

## MUST NOT
- A flag MUST NOT be used to pretend an inherently irreversible migration is safely reversible.
- Old readers MUST NOT be broken before compatibility windows close.
- Destructive cleanup MUST NOT execute solely because a rollout reached 100%.

## SHOULD
- Read-path and write-path transitions SHOULD be separated when this reduces risk.

## Exceptions
Breaking migrations require explicit architecture and production approval with tested recovery strategy.

## Verification
Review compatibility tests, deployment ordering, migration telemetry, data reconciliation, and rollback exercises.