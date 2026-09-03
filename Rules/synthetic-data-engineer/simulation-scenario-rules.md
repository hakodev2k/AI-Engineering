# Simulation Scenario Rules

## Purpose
Ensure simulation-derived synthetic data represents explicitly defined scenarios, assumptions, and operating envelopes.

## Scope
Applies to physical, behavioral, operational, network, financial, robotic, traffic, environmental, and other simulation-based data generation.

## MUST
- Define scenario objectives, parameter ranges, boundary conditions, and assumptions before large-scale simulation.
- Separate calibrated parameters from hypothetical stress parameters and label both clearly.
- Validate simulator behavior against known observations or trusted reference cases where possible.
- Cover nominal, boundary, failure, and recovery scenarios when relevant to downstream risk.
- Record random seeds, simulator versions, environment configuration, and parameter distributions required to reproduce a scenario.
- Document known simulator blind spots and physics or behavior not modeled.

## MUST NOT
- Present simulated frequency as real-world prevalence unless calibrated evidence supports that interpretation.
- Expand parameter ranges beyond model validity without marking resulting data as extrapolative.
- Hide simulator defects with post-processing that changes scenario meaning.
- Use one nominal scenario as evidence for resilience across operating conditions.

## SHOULD
- Use scenario matrices or design-of-experiments methods to improve coverage efficiently.
- Prioritize scenarios by consequence and uncertainty.
- Compare simulated and observed failure signatures where operational evidence exists.

## Exceptions
Unvalidated extrapolative scenarios require explicit labeling, rationale, uncertainty bounds, and human review before consequential use.

## Verification
Review scenario manifests, parameter distributions, calibration evidence, seed and version records, coverage matrices, and comparisons against trusted reference observations.