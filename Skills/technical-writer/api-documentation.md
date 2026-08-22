# API Documentation

## Purpose
Create accurate, usable API guidance that connects contracts to developer goals, security, errors, and operational behavior.
## When to use
Use for REST, GraphQL, RPC, SDK-backed, or partner APIs.
## Inputs
API contract, implementation, auth model, examples, error behavior, versioning policy.
## Context to inspect
OpenAPI/schema, source code, tests, gateways, SDKs, changelog, support issues.
## Core knowledge
Reference describes what exists; guides explain how to succeed. Document semantics not obvious from schema: authorization, idempotency, pagination, limits, retries, ordering, and errors.
## Procedure
1. Validate contract against implementation/tests.
2. Define authentication and prerequisites.
3. Document resource/domain semantics.
4. Explain endpoints/operations and constraints.
5. Provide minimal executable examples.
6. Cover errors, limits, pagination, retries, and idempotency.
7. Document compatibility/version behavior.
8. Test examples against a representative environment.
9. Link reference to task-oriented guides.
## Decision points
Generate mechanical reference from schemas where reliable; hand-author semantics and workflows.
## Common failure patterns
Schema-only docs, fake examples, undocumented permissions, happy-path errors, stale parameters.
## Verification
Run examples and compare documented responses/constraints with contract and observed behavior.
## Expected output
Accurate reference plus task guidance for API consumers.
## Stop conditions
Escalate undocumented behavior or security semantics that cannot be verified.