# IAM Integration Testing

## Purpose
Verify identity integrations across normal, negative, lifecycle, security, and failure scenarios before they become production access paths.

## When to use
Use for new SSO/SCIM/API/PAM integrations, protocol upgrades, policy changes, migrations, and regression protection.

## Inputs
Requirements, protocol configuration, test tenants/accounts, entitlement mappings, lifecycle rules, failure modes, and expected audit events.

## Context to inspect
Inspect authentication, authorization, provisioning, deprovisioning, groups, claims, sessions, recovery, retries, rate limits, audit logs, and rollback paths.

## Core knowledge
IAM testing must prove denial and lifecycle behavior, not only successful login. Security failures often appear in stale state, wrong tenant, duplicate provisioning, expired tokens, or recovery paths.

## Procedure
1. Convert security and lifecycle requirements into test scenarios.
2. Create isolated representative test identities.
3. Test successful authentication and correct claims.
4. Test unauthorized users, wrong tenant, wrong audience, and invalid/expired tokens.
5. Test provisioning create/update/disable/re-enable/delete.
6. Test group and entitlement changes.
7. Test retries, duplicate requests, rate limits, and partial failures.
8. Test logout, revocation, recovery, and key rotation.
9. Verify expected audit events.
10. Repeat critical scenarios after deployment.

## Decision points
Automate deterministic protocol/lifecycle regression tests. Keep destructive, emergency, or external-provider scenarios controlled when full automation would create risk.

## Common failure patterns
Testing login only, no negative authorization cases, production-only validation, shared test accounts, ignoring eventual consistency, and accepting UI success without checking effective access.

## Verification
Require evidence for each scenario: protocol result, effective access state, target-system state, and audit event. Distinguish implemented configuration from verified behavior.

## Expected output
A reusable IAM integration test suite/checklist with results, defects, evidence, and residual risks.

## Stop conditions
Stop when safe test identities/environments are unavailable or verification would require destructive production actions without approval.