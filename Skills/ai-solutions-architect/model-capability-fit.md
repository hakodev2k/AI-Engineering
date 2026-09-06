# Model Capability Fit

## Purpose
Determine what model capabilities a solution actually requires and prevent architecture from being coupled to an unnecessarily large or expensive model.

## When to use
Use during solution design, model replacement, quality regression analysis, or cost optimization.

## Inputs
Task taxonomy, representative examples, quality targets, latency targets, modalities, context needs, tool requirements, and risk constraints.

## Context to inspect
Inspect real task samples, failure cases, language coverage, structured-output needs, context length, tool-calling behavior, multimodal inputs, and deployment restrictions.

## Core knowledge
Model quality is task-specific. Parameter count, benchmark rank, and context window do not guarantee production fit. Capability must be evaluated together with latency, price, reliability, safety, and integration behavior.

## Procedure
1. Break the workload into distinct task classes.
2. Define minimum acceptable capability for each class.
3. Identify required modalities, context, reasoning, tool use, and structured output.
4. Build representative evaluation cases including edge conditions.
5. Compare candidate models against task-level thresholds.
6. Measure latency, failure rate, token usage, and operational constraints.
7. Test smaller models before assuming a frontier model is required.
8. Decide whether routing by task class improves quality or cost.
9. Document unsupported capabilities and fallback behavior.
10. Revalidate when model versions change.

## Decision points
Prefer the smallest model that reliably meets requirements. Use heterogeneous routing when workloads have materially different complexity. Self-host only when control, economics, data locality, or specialized optimization justify operational burden.

## Common failure patterns
Selecting by benchmark reputation, testing only happy paths, ignoring structured-output failures, and treating a provider model alias as immutable.

## Verification
Candidate models pass representative evaluations and NFR thresholds with measured evidence.

## Expected output
A capability matrix, recommended model strategy, routing rules, limitations, and reevaluation triggers.

## Stop conditions
Stop when evaluation data is unrepresentative, required capabilities cannot be tested, or provider restrictions conflict with mandatory requirements.