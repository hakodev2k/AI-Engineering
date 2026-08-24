# Quantum System Architecture

## Purpose
Design an end-to-end quantum solution that makes the boundary between classical services, quantum workloads, hardware constraints, data movement, orchestration, and verification explicit.

## When to use
Use when starting a quantum-enabled product, evaluating whether a quantum component belongs in an existing system, or reviewing a hybrid architecture. Do not use when the problem can already be solved more simply and economically with classical methods.

## Inputs
Business objective, candidate problem, data shape, latency expectations, hardware/backend options, classical baseline, security constraints, cost limits, experiment requirements.

## Preconditions
A measurable objective and classical reference approach exist. Hardware access and SDK assumptions are documented rather than implied.

## Context to inspect
Existing services, optimization/simulation workflow, data preparation, model sizes, circuit depth expectations, backend queueing, shot limits, noise characteristics, credential boundaries, and deployment constraints.

## Core knowledge
Quantum systems are hybrid systems. Useful architecture depends on algorithmic suitability, qubit count and connectivity, noise, circuit depth, sampling cost, classical orchestration, and the ability to validate results against classical baselines. Backend portability usually requires an intermediate abstraction rather than direct dependence on one provider.

## Procedure
1. Define the decision or computation the system must improve.
2. Establish classical baseline quality, latency, cost, and scale.
3. Identify the exact subproblem proposed for quantum execution.
4. Estimate logical and physical resource needs.
5. Separate data preparation, circuit construction, execution, sampling, and post-processing.
6. Define backend abstraction and provider-specific adaptation points.
7. Model queueing, retry, timeout, cancellation, and partial-result behavior.
8. Define experiment metadata and reproducibility requirements.
9. Design observability for backend, circuit, shot, and result quality.
10. Specify fallback to classical execution when quantum execution is unavailable or unjustified.
11. Review security and data-governance boundaries.
12. Validate architecture with representative experiments before committing to production integration.

## Decision points
Choose simulator vs hardware based on purpose, not convenience. Choose provider-specific optimization only when measurable gains exceed portability cost. Use synchronous execution only for bounded interactive workloads; use asynchronous job orchestration for long queues or large experiment batches.

## Common failure patterns
No classical baseline, treating quantum hardware as a normal low-latency service, provider lock-in hidden in domain code, missing reproducibility metadata, ignoring sampling variance, and architectures with no classical fallback.

## Verification
Confirm the target subproblem is clearly isolated, resource estimates fit candidate backends, failure behavior is explicit, and representative runs can be reproduced. Architecture is verified only when measured experiments support its assumptions.

## Expected output
Architecture diagram, component responsibilities, backend contract, resource assumptions, fallback path, experiment lifecycle, risks, and acceptance evidence.

## Stop conditions
Stop and escalate when resource estimates exceed feasible hardware, data or security constraints prohibit the workflow, or the quantum path has no credible advantage over the classical baseline.