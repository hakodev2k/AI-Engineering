# Environment Strategy

## Purpose
Design development, test, staging, and production environments that balance fidelity, cost, isolation, and speed.

## When to use
Use when creating environments, reducing drift, redesigning promotion flow, or managing ephemeral environments.

## Inputs
Delivery workflow, test needs, data constraints, infrastructure cost, compliance, release strategy.

## Context to inspect
Current environment differences, shared dependencies, test data, configuration drift, provisioning time, access boundaries.

## Core knowledge
Environments should differ only where purpose requires it. Production-like behavior matters for critical integration and deployment tests, but full permanent duplication can be wasteful.

## Procedure
1. Define purpose of each environment.
2. Identify required fidelity by dependency.
3. Provision through shared IaC modules.
4. Separate accounts/subscriptions/projects where trust requires.
5. Standardize configuration schema.
6. Use synthetic/masked test data.
7. Add ephemeral environments for branch validation where valuable.
8. Define lifecycle and cleanup.
9. Measure drift regularly.
10. Document promotion path.

## Decision points
Use shared non-prod services only when isolation risk is acceptable; prefer ephemeral environments for parallel feature testing if provisioning is fast enough.

## Common failure patterns
Staging unlike prod, permanent orphaned environments, production data copied casually, manual config drift, shared credentials.

## Verification
Environment can be recreated from code, promotion behavior matches production assumptions, and drift checks are clean.

## Expected output
Purpose-driven environment model with reproducible provisioning and controlled cost.

## Stop conditions
Stop when environment design would expose production secrets or sensitive data improperly.