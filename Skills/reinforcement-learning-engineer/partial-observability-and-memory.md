# Partial Observability and Memory

## Purpose
Design RL agents for environments where the current observation is insufficient to infer decision-relevant state, requiring history, belief estimation, or learned memory.

## When to use
Use when hidden state, delayed sensors, occlusion, asynchronous events, or incomplete business context makes reactive policies brittle.

## Inputs
- Observation streams and timestamps
- Candidate hidden-state factors
- Episode structure
- Policy architecture and latency budget

## Preconditions
Confirm that missing information is genuinely unavailable rather than omitted accidentally from the observation contract.

## Context to inspect
Inspect temporal correlations, sensor latency, observation dropouts, history length, reset semantics, leakage across episodes, and whether deployment preserves sequence ordering.

## Core knowledge
POMDP-style problems require reasoning over latent state. Frame stacking, recurrent networks, transformers, belief-state filters, and explicit state estimators provide different complexity/latency trade-offs. Memory can also memorize artifacts, leakage, or environment IDs.

## Procedure
1. Identify decisions where identical observations require different actions because of history.
2. Quantify useful temporal context with diagnostic probes or baselines.
3. Establish a reactive-policy baseline.
4. Add the simplest sufficient history representation.
5. Validate sequence boundaries and hidden-state reset behavior.
6. Test recurrent or attention-based memory only when simpler context stacking is insufficient.
7. Measure performance versus context length and inference latency.
8. Stress-test missing, delayed, and reordered observations.
9. Inspect whether memory encodes forbidden future or episode identity information.
10. Verify state behavior after resets and long idle periods.

## Decision points
Prefer explicit filters/state estimators when domain dynamics are known. Prefer learned memory when latent-state structure is complex and sufficient trajectories exist. Keep context minimal when latency and robustness dominate.

## Common failure patterns
- Hidden state leaks across episodes.
- Long context improves training but breaks latency budgets.
- Sequence padding or masks are incorrect.
- Memory learns simulator identifiers instead of task state.

## Verification
Compare reactive and memory-enabled baselines across hidden-state scenarios, resets, observation loss, and latency constraints. Confirm no temporal leakage.

## Expected output
A memory architecture with justified context length, sequence semantics, robustness tests, and deployment-state handling.

## Stop conditions
Stop if required latent information is fundamentally unobservable, sequence data is unreliable, or memory latency exceeds operational limits.