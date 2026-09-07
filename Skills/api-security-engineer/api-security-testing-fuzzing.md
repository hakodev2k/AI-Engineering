# API Security Testing and Fuzzing

## Purpose
Build a repeatable security-testing strategy that finds API-specific weaknesses through negative tests, adversarial cases, schema-aware fuzzing, authorization matrix tests, and abuse simulations.

## When to use
Use before launch, after material API changes, during security hardening, after incidents, when adopting new parsers/frameworks, or when expanding third-party exposure.

## Inputs
API contracts, authentication methods, authorization rules, test identities, data models, rate limits, deployment environment, known threat scenarios, production defect history.

## Preconditions
Use a non-destructive test environment or explicitly approved production-safe probes. Obtain representative identities for roles and tenants.

## Context to inspect
OpenAPI/GraphQL schemas, endpoint inventory, request validators, authorization middleware, business workflows, parsers, file handling, rate controls, logs, and test infrastructure.

## Core knowledge
Security testing should emphasize negative behavior and invariant violations, not only signatures for known vulnerabilities. Schema-aware fuzzers can explore malformed and boundary input; stateful tests are needed for workflows, authorization, replay, and race conditions. Automated scanners complement but do not replace threat-driven manual tests.

## Procedure
1. Derive test objectives from the threat model and API inventory.
2. Build positive and negative identities across roles and tenants.
3. Generate object- and function-authorization matrix tests.
4. Test malformed, boundary, oversized, duplicate, and unexpected input.
5. Fuzz parsers and schema-constrained fields with reproducible seeds.
6. Test mass assignment, injection, SSRF, replay, idempotency, and enumeration scenarios where applicable.
7. Simulate rate-abuse and resource-exhaustion patterns within safe limits.
8. Test error responses for sensitive leakage.
9. Verify gateway and direct-backend paths behave consistently.
10. Capture minimal reproducible cases for every finding.
11. Convert remediated findings into regression tests.
12. Separate scanner noise from evidence-backed vulnerabilities.

## Decision points
Use property-based and schema fuzzing for broad input spaces, targeted adversarial tests for high-impact business flows, and manual review where contextual authorization cannot be inferred automatically. Run destructive load tests only in isolated environments.

## Common failure patterns
Happy-path-only automation, scanner-result dumping, no cross-tenant identities, irreproducible fuzz findings, testing only gateway URLs, overloading shared environments, and closing findings without regression protection.

## Verification
Re-run reproducible exploits after fixes, confirm expected rejection without side effects, and ensure regression suites fail when protections are intentionally removed in controlled tests.

## Expected output
A prioritized API security test suite with reproducible adversarial cases, automation coverage, evidence, and regression tests tied to important threats.

## Stop conditions
Escalate when safe test boundaries are undefined, representative identities cannot be obtained, a test could damage production data, or evidence suggests active compromise requiring incident response.