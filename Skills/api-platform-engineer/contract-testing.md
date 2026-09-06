# API Contract Testing

## Purpose
Detect provider/consumer incompatibilities before deployment and distinguish schema compliance from real behavioral compatibility.

## When to use
Use for independently deployed services, external APIs, SDK generation, or frequent contract evolution.

## Inputs
Provider contract, consumer expectations, fixtures, deployment topology, compatibility policy.

## Context to inspect
Inspect integration tests, mocks, schemas, consumer versions, test environments, and prior compatibility incidents.

## Core knowledge
Provider tests prove implementation matches the declared contract; consumer-driven tests capture actual expectations. Neither replaces end-to-end tests for critical workflows.

## Procedure
1. Identify contract boundary and owners.
2. Select schema validation and consumer-driven testing where appropriate.
3. Validate provider responses and errors against the contract.
4. Capture consumer assumptions that schemas cannot express.
5. Test optionality, enums, nullability, ordering, pagination, and error behavior.
6. Run compatibility checks on every contract change.
7. Publish versioned test artifacts if consumers/providers deploy independently.
8. Gate breaking changes according to policy.
9. Keep fixtures representative but minimal.
10. Periodically compare tests with production behavior.

## Decision points
Use consumer-driven contracts for important independently evolving consumers; avoid coupling providers to incidental consumer implementation details.

## Common failure patterns
Mocks diverging from production, schema-only confidence, brittle snapshots, and tests that prevent legitimate additive evolution.

## Verification
Introduce controlled incompatible changes and confirm CI catches them; validate representative real interactions.

## Expected output
Automated evidence that provider and consumer expectations remain compatible.

## Stop conditions
Stop when the authoritative contract or consumer ownership cannot be identified.