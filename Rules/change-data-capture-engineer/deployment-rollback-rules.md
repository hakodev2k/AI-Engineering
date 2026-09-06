# Deployment and Rollback Rules

## Purpose
Release CDC changes without losing positions, breaking contracts, or creating unrecoverable divergence.

## Scope
Connector upgrades, configuration, rolling deployment, rollback, canaries, and cutover.

## MUST
- Deployments MUST preserve compatible checkpoint and schema-history state.
- Upgrade plans MUST define rollback feasibility before production execution.
- High-impact changes MUST use progressive validation where practical.
- Post-deployment checks MUST validate source progress, lag, errors, and representative sink correctness.
- Version compatibility with source, broker, schema, and sink systems MUST be established.

## MUST NOT
- MUST NOT delete old checkpoint formats before rollback risk expires.
- MUST NOT combine unrelated connector, schema, and infrastructure changes without justification.
- MUST NOT declare success solely because the process is running.

## SHOULD
- Canary connector/runtime changes on representative low-risk streams.
- Keep configuration changes reviewable and versioned.

## Exceptions
Emergency deployment requires explicit human authority, minimized blast radius, and immediate verification.

## Verification
Inspect release diffs, compatibility tests, rollback rehearsal, canary metrics, and post-release reconciliation.