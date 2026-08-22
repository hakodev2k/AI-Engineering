# Test Environment Management

## Purpose
Keep automation environments reproducible, observable, isolated enough for reliable evidence, and close enough to production for intended claims.

## When to use
Use for CI environments, shared QA systems, ephemeral deployments, or environment-related flakiness.

## Inputs
Infrastructure topology, deployment process, configuration, dependencies, test suites, environment policy.

## Context to inspect
Versions, feature flags, secrets, DNS/network, databases, queues, external sandboxes, clocks, capacity, seed data, and concurrent users.

## Core knowledge
A test result is only as trustworthy as the environment claim behind it. Prefer infrastructure/configuration as code and ephemeral isolation where cost permits.

## Procedure
1. Define what each environment is allowed to prove.
2. Version application and infrastructure configuration.
3. Validate deployment health before tests start.
4. Seed only required deterministic reference data.
5. Isolate test-owned resources by namespace or environment.
6. Expose environment metadata in reports.
7. Detect dependency/version drift automatically.
8. Monitor capacity and shared-resource contention.
9. Tear down ephemeral resources reliably.
10. Document known production differences.

## Decision points
Use ephemeral environments for high isolation; use shared environments when cost/complexity dominates, with strong namespacing and scheduling. Never claim production equivalence without evidence.

## Common failure patterns
Unknown deployed version, manual config drift, shared mutable data, tests starting before readiness, hidden feature flags, environment treated as the default explanation for failures.

## Verification
Recreate an environment from declared configuration, run health checks and representative suites, and compare key production differences.

## Expected output
Documented environment guarantees, automated readiness checks, and reproducible configuration.

## Stop conditions
Escalate when environment drift or missing access prevents trustworthy conclusions.