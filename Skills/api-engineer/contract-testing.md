# API Contract Testing

## Purpose
Detect incompatible API changes and mismatches between documented and runtime behavior.

## When to use
Use in CI/CD for shared APIs, generated clients, and multi-team integrations.

## Inputs
API schema, provider implementation, consumer expectations, and compatibility policy.

## Context to inspect
OpenAPI documents, consumer contracts, test environments, mock servers, and deployment pipeline.

## Core knowledge
Contract tests complement unit and end-to-end tests. Provider tests prove implementation satisfies contract; consumer-driven contracts capture expectations but require governance to avoid coupling to accidental behavior.

## Procedure
1. Define authoritative contract artifacts.
2. Add schema lint and compatibility diff checks.
3. Validate provider responses against schemas.
4. Capture critical consumer expectations.
5. Test error and boundary responses, not only success.
6. Run tests before merge and deployment.
7. Publish versioned contract artifacts.
8. Block incompatible changes unless migration is approved.

## Decision points
Use schema-based tests for broad protocol correctness; add consumer-driven contracts when independent teams need explicit compatibility guarantees.

## Common failure patterns
Snapshotting unstable payloads, ignoring error contracts, testing mocks only, and allowing contract artifacts to drift from runtime.

## Verification
Intentional breaking changes fail the pipeline; valid additive changes pass and runtime conformance is demonstrated.

## Expected output
Automated compatibility gates and conformance evidence.

## Stop conditions
Escalate if no contract owner or compatibility policy exists.