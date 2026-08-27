# Production Change and Approval Rules

## Purpose
Prevent automated or unilateral actions from changing production trust or cryptographic guarantees beyond authorized scope.

## Scope
Production key operations, trust stores, algorithm policy, cryptographic configuration, deployment, and destructive actions.

## MUST
- Distinguish analysis, recommendation, preparation, and execution in operational procedures and agent permissions.
- Obtain explicit human approval before production deployment, secret/key rotation with material blast radius, trust-anchor changes, security-control weakening, destructive key deletion, or irreversible cryptographic migration.
- Prepare rollback or recovery procedures and verify prerequisites before approved execution.

## MUST NOT
- Let an AI agent silently expand its authority from diagnosis or preparation into execution.
- Delete the last recoverable key version while protected data still depends on it.

## SHOULD
- Use two-person control for exceptionally high-impact trust anchors.

## Exceptions
Pre-authorized automated routine rotation may execute within documented scope, safeguards, and rollback conditions.

## Verification
Review IAM, approval records, automation scopes, audit logs, runbooks, rollback tests, and production change records.