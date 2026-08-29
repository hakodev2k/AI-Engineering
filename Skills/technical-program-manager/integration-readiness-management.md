# Integration Readiness Management

## Purpose
Ensure independently developed components are ready to integrate through explicit contracts, environments, test data, ownership, and acceptance evidence.

## When to use
Use before system integration, end-to-end testing, partner onboarding, platform cutovers, or multi-service launches.

## Inputs
Interface contracts, component status, test plans, environment readiness, dependency map, known defects.

## Context to inspect
API/schema versions, feature flags, deployment order, test environments, observability, rollback paths, and ownership.

## Core knowledge
Integration failures often come from assumptions at boundaries rather than component code. Senior TPMs force interface and environment readiness to become visible before final integration windows.

## Procedure
1. List all integration boundaries and owning teams.
2. Verify contract versions and backward-compatibility expectations.
3. Confirm environments, credentials, fixtures, and test data are available.
4. Identify deployment and configuration sequencing.
5. Define integration acceptance tests and evidence owners.
6. Run early contract or smoke tests.
7. Track incompatibilities as blocking issues.
8. Validate observability and rollback before production integration.

## Decision points
Use stubs or simulators when dependencies are unavailable but contracts are stable. Delay integration when unknown boundary behavior creates unacceptable risk.

## Common failure patterns
Late contract changes, missing environments, incompatible schemas, no test data, and testing only the happy path.

## Verification
Execute representative end-to-end scenarios and confirm failures can be diagnosed from telemetry.

## Expected output
An evidence-backed integration readiness state and clear list of remaining blockers.

## Stop conditions
Stop when critical contracts are undefined, required environments are unavailable, or unresolved incompatibilities make testing invalid.