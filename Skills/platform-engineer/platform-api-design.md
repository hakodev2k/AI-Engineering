# Platform API Design

## Purpose
Design stable self-service APIs that expose platform capabilities without leaking unnecessary implementation detail.

## When to use
Use for provisioning, deployment, configuration, environment, identity, or operational platform services.

## Inputs
Consumer workflows, domain model, backend capabilities, policies, and lifecycle requirements.

## Context to inspect
Existing APIs, CLIs, portals, schemas, async operations, errors, permissions, and compatibility commitments.

## Core knowledge
Platform APIs need explicit ownership, idempotency, versioning, asynchronous state models, actionable errors, and safe defaults.

## Procedure
1. Model consumer intent rather than backend resources alone.
2. Define resources and lifecycle states.
3. Specify authentication and authorization.
4. Define idempotency and retry behavior.
5. Model long-running operations explicitly.
6. Standardize validation and errors.
7. Define compatibility and deprecation policy.
8. Publish contracts and examples.
9. Add contract and integration tests.

## Decision points
Prefer declarative desired-state APIs for managed resources; use imperative actions for bounded operations. Add abstraction only when it creates stable consumer value.

## Common failure patterns
Leaking vendor details, breaking schemas, ambiguous async states, missing idempotency, and generic errors.

## Verification
Contract tests pass, retries are safe, unauthorized operations fail correctly, and old clients remain compatible.

## Expected output
A versioned platform API contract with lifecycle, security, errors, and compatibility rules.

## Stop conditions
Stop when resource ownership or lifecycle semantics remain ambiguous.