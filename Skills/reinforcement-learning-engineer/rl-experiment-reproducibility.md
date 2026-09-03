# RL Experiment Reproducibility

## Purpose
Make RL experiments repeatable enough to distinguish algorithmic effects from seed variance, environment drift, dependency changes, and hidden configuration differences.

## When to use
Use for every serious RL experiment, benchmark comparison, incident investigation, and candidate release.

## Inputs
- Training code and configuration
- Environment/simulator version
- Dataset or replay source
- Random seeds
- Dependency and hardware metadata

## Preconditions
The training pipeline must expose configurable seeds and versioned inputs.

## Context to inspect
Inspect random-number generators, nondeterministic accelerator kernels, environment seeds, scenario ordering, data-loader concurrency, dependency versions, checkpoint contents, and external services.

## Core knowledge
Exact bitwise determinism is not always practical, but reproducibility requires controlled sources of randomness and enough provenance to explain variation. RL needs independent training seeds and environment seeds because stochastic interaction compounds over time.

## Procedure
1. Version code, environment, reward, preprocessing, and configuration together.
2. Seed all relevant random generators explicitly.
3. Record training and evaluation seeds separately.
4. Capture dependency, driver, hardware, and runtime versions.
5. Store immutable experiment configuration with each run.
6. Include optimizer and required environment/replay state in checkpoints.
7. Re-run a reference configuration to estimate natural variance.
8. Verify checkpoint resume produces statistically consistent continuation.
9. Track schema changes in logged metrics and trajectories.
10. Require reproducible commands or workflow definitions for benchmark claims.

## Decision points
Use deterministic kernels when their cost is acceptable and exact diagnosis matters. Otherwise define statistical reproducibility bounds and validate across multiple seeds.

## Common failure patterns
- Only framework RNG is seeded.
- Environment version changes silently.
- Best seed is promoted as the result.
- Resume omits optimizer or normalization state.
- Evaluation scenarios are regenerated inconsistently.

## Verification
A run is reproducible when the same versioned inputs recreate results within documented statistical bounds and a checkpoint can be restored with matching semantics.

## Expected output
A reproducible experiment package containing versioned configuration, seeds, provenance, checkpoint policy, and variance evidence.

## Stop conditions
Stop when critical environment/data versions cannot be recovered, hidden external state changes outcomes, or experiment provenance is incomplete enough to invalidate comparison.