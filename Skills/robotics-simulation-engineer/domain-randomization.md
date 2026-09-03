# Domain Randomization

## Purpose
Use controlled variation in simulation to improve robustness and expose sensitivity without replacing disciplined model calibration with arbitrary randomness.

## When to use
Use for sim-to-real policy/perception transfer, robustness testing, uncertainty analysis, and training systems that must tolerate hardware or environmental variability.

## Inputs
Calibrated baseline model, field distributions, parameter uncertainty ranges, task metrics, training/evaluation split, known deployment variation.

## Preconditions
Nominal parameters must be credible before randomization begins.

## Context to inspect
Dynamics, friction, mass, actuator gains, sensor noise, latency, lighting, textures, object poses, geometry tolerances, environmental conditions, and correlations between variables.

## Core knowledge
Randomization works when distributions cover plausible deployment variation while preserving causal structure. Independent wide uniform ranges often create impossible worlds and teach policies to compensate for simulator artifacts. Calibration defines centers; uncertainty evidence defines ranges and correlations.

## Procedure
1. Identify parameters that materially influence task outcomes.
2. Estimate nominal values and uncertainty from measurements.
3. Define physically plausible distributions and correlations.
4. Separate training randomization from held-out evaluation distributions.
5. Start with narrow high-confidence ranges.
6. Run sensitivity analysis to find dominant parameters.
7. Expand ranges only where deployment evidence supports it.
8. Track sampled parameters for every run.
9. Evaluate robustness by slices, not only aggregate success.
10. Compare transferred behavior against physical tests and refine distributions.

## Decision points
Randomize nuisance factors aggressively only when semantics remain valid. Use system-identification distributions for dynamics; empirical distributions for sensors/environments; adversarial sweeps for boundary testing.

## Common failure patterns
Uniform randomization everywhere; impossible parameter combinations; leakage of evaluation distributions into tuning; using randomization to hide a biased simulator; missing correlations.

## Verification
Verify samples match declared distributions, scenarios remain physically valid, performance is stable across relevant slices, and physical transfer improves or robustness gaps become measurable.

## Expected output
A versioned randomization specification with distributions, evidence, correlations, sensitivity results, and evaluation boundaries.

## Stop conditions
Escalate when uncertainty ranges lack evidence, randomization makes task semantics invalid, or transfer failures indicate missing physics rather than parameter variation.