# Rare Event and Edge-Case Generation

## Purpose
Generate targeted synthetic scenarios for rare, safety-critical, boundary, or failure conditions that are underrepresented in real datasets.

## When to use
Use when production failures cluster in low-frequency scenarios, when collecting real examples is impractical, or when evaluation must cover known hazards.

## Inputs
Failure reports, risk register, scenario taxonomy, real prevalence estimates, domain constraints, target task, generation controls.

## Preconditions
Rare scenarios are defined precisely enough to distinguish valid edge cases from impossible artifacts.

## Context to inspect
Incident history, confusion matrices, subgroup metrics, outliers, boundary values, safety analyses, operational constraints, domain expert feedback.

## Core knowledge
Rare-event synthesis is valuable because training data frequency and business importance are not the same. However, oversampling changes class priors and can distort calibration if not handled deliberately.

## Procedure
1. Rank rare scenarios by severity, likelihood, and current model weakness.
2. Define scenario attributes and validity rules.
3. Generate controlled variations around each scenario.
4. Include near-boundary negatives to prevent shortcut learning.
5. Record synthetic prevalence separately from estimated production prevalence.
6. Validate scenario realism with rules, experts, or real exemplars.
7. Train or evaluate using stratified mixes.
8. Recalibrate or reweight downstream systems when priors are intentionally changed.
9. Measure improvement on independent real rare-event data when available.
10. Add newly observed production failures back into the scenario catalog.

## Decision points
Oversample heavily for representation learning or robustness testing; preserve realistic prevalence for production metric estimation and calibration.

## Common failure patterns
Creating caricatured edge cases, omitting hard negatives, confusing rarity with importance, and reporting synthetic test pass rates as production performance.

## Verification
Targeted scenarios are valid, diverse, and improve detection or robustness without unacceptable regression on common cases.

## Expected output
A versioned rare-event corpus with scenario definitions, generation controls, prevalence notes, and validation results.

## Stop conditions
Stop when scenario validity cannot be established or generated examples create misleading shortcuts that cannot be removed.