# Request and Response Transformation

## Purpose
Apply controlled protocol or contract adaptations at the gateway without hiding incompatible service designs.

## When to use
Use for header mapping, path rewrites, envelope adaptation, legacy compatibility, or protocol mediation.

## Inputs
Source contract, target contract, compatibility requirements, transformation rules.

## Context to inspect
Current consumers, backend schema, versioning policy, error formats, payload sizes, transformation cost.

## Core knowledge
Transformations add latency, coupling, and debugging complexity. They should be deterministic, observable, reversible where possible, and never weaken validation or security.

## Procedure
1. Define the precise compatibility gap.
2. Prefer backend-native compatibility when feasible.
3. Specify transformation input/output contracts.
4. Preserve authentication and tracing context safely.
5. Handle errors explicitly.
6. Bound payload and compute cost.
7. Add transformation-specific tests and metrics.
8. Document removal criteria for temporary adapters.

## Decision points
Use gateway transformation for transport-level or migration concerns; avoid embedding domain orchestration or complex business mapping.

## Common failure patterns
Silent field loss, inconsistent error mapping, hidden permanent legacy logic, transforming before validation, leaking internal headers.

## Verification
Golden contract cases, backward-compatibility tests, latency measurements, and failure-path checks pass.

## Expected output
A minimal, versioned transformation with clear ownership and retirement plan.

## Stop conditions
Escalate when transformation changes business meaning or lacks an authoritative target contract.