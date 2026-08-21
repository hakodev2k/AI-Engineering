# Skill: CI/CD Pipeline Engineering

## Purpose
Design or modify a pipeline so every stage has explicit inputs, deterministic outputs, bounded failure behavior, security boundaries, and useful evidence.

## Trigger
New pipeline, workflow refactor, slow pipeline, unreliable pipeline, new quality gate, new build/deploy target, or recurring CI failure.

## Inputs
Repository structure, build commands, test suites, artifact requirements, environment targets, secrets model, branch/release policy, runtime dependencies, compliance constraints, and existing pipeline evidence.

## Preconditions
- Source and target delivery behavior are understood.
- Required credentials are referenced, not copied.
- The agent knows which environments may be changed.

## Procedure
1. Map source event -> stages -> artifacts -> deployment targets -> evidence.
2. Identify required versus optional gates.
3. Separate build once from deploy many; prefer immutable artifacts.
4. Identify cache boundaries and invalidation keys.
5. Define explicit job dependencies; maximize safe read-only/test parallelism.
6. Serialize jobs that mutate the same environment or state.
7. Apply least-privilege permissions to workflow identities.
8. Add timeouts and bounded retries only for classified transient operations.
9. Prevent secrets from appearing in command echo, artifacts, test data, or logs.
10. Add failure diagnostics useful enough to distinguish code, infra, permission, and external-service failures.
11. Validate locally or in a safe branch/environment where possible.
12. Review the pipeline change independently before merge.

## Decision rules
- If an artifact can be rebuilt differently between environments, prefer promotion of the original immutable artifact.
- If two jobs write the same external resource, run them sequentially unless the resource guarantees safe concurrency.
- If a failure source is unknown, gather evidence before retrying.
- If a gate is expensive, optimize its trigger/scope before removing it.

## Constraints
MUST NOT embed secrets, disable critical checks just to obtain green status, or depend on arbitrary sleep as synchronization.

## Outputs
Pipeline definition/change, dependency map, permission notes, validation evidence, failure-mode notes, and residual risks.

## Quality and verification
Verify trigger behavior, dependency graph, clean-environment reproducibility, failure diagnostics, secret redaction, artifact identity, and target-environment safety. Test both success and at least one meaningful failure path.

## Failure handling
Retry transient network/service operations at most the configured count with backoff. Do not retry syntax, permission, test assertion, policy, or configuration errors without a corrective change.

## Stop conditions
Stop when required permissions are unavailable, a production-destructive action lacks approval, or acceptance/release policy is ambiguous enough to make execution unsafe.