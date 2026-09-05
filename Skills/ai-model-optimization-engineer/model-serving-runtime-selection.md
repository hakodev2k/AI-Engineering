# Model Serving Runtime Selection

## Purpose
Select and configure an inference runtime that fits model features, hardware, workload, operability, and cost.

## When to use
Before a serving migration, new model deployment, or major optimization program.

## Inputs
Model formats, required operators/features, hardware, traffic profile, SLOs, deployment platform, security and operational requirements.

## Preconditions
Define weighted acceptance criteria and representative benchmark scenarios.

## Context to inspect
Inspect framework compatibility, quantization support, dynamic shapes, batching, distributed execution, observability, upgrade cadence, ecosystem maturity, and fallback paths.

## Core knowledge
Runtime benchmarks are workload-specific. Maximum tokens/sec is insufficient when operational reliability, tail latency, model support, cold starts, or debugging differ.

## Procedure
1. Define must-have compatibility and SLO requirements.
2. Shortlist maintained runtimes.
3. Build equivalent model artifacts/configurations.
4. Benchmark quality/correctness first.
5. Benchmark latency, throughput, memory, startup, and cost.
6. Test representative shapes and concurrency.
7. Evaluate observability, failure handling, upgrades, and security posture.
8. Estimate migration/maintenance cost.
9. Run failure and rollback exercises.
10. Document the decision and assumptions.

## Decision points
Choose the simplest runtime meeting constraints; accept specialized complexity only for material durable gains.

## Common failure patterns
Vendor benchmark dependence, different precisions across candidates, ignoring cold start and operations, unsupported model features discovered late.

## Verification
Chosen runtime passes compatibility, correctness, load, resilience, and operational acceptance tests on target infrastructure.

## Expected output
Decision matrix, reproducible benchmarks, selected runtime/configuration, risks, and rollback plan.

## Stop conditions
Stop if candidates cannot be compared equivalently or required licensing/security/compatibility facts are unresolved.