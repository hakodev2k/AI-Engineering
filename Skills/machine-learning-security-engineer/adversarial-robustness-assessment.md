# Adversarial Robustness Assessment

## Purpose
Evaluate whether adversarially manipulated inputs can cause security-relevant model failures and determine appropriate defenses.

## When to use
Use for exposed classifiers, perception systems, fraud/abuse models, biometric systems, or other models where an attacker can influence inputs.

## Inputs
Model interface, task definition, attacker capabilities, baseline dataset, threat model, metrics, and deployment constraints.

## Preconditions
Define acceptable testing scope and safety constraints. Use representative data and a reproducible model version.

## Context to inspect
Inspect preprocessing, normalization, feature extraction, thresholds, ensembles, downstream business logic, and rate/identity controls surrounding the model.

## Core knowledge
Robustness must be measured against a stated threat model. White-box, gray-box, and black-box attacks imply different attacker knowledge and cost. Small benchmark perturbations are not automatically realistic; operational attacks may exploit transformations, sensors, query access, or business logic.

## Procedure
1. Define the security property and attacker goal.
2. Specify attacker knowledge, access, budget, and perturbation constraints.
3. Establish clean-data performance.
4. Select attacks appropriate to model modality and threat model.
5. Run reproducible attack experiments across representative classes and edge cases.
6. Measure attack success, confidence changes, and downstream impact.
7. Test preprocessing and detection defenses against adaptive attacks.
8. Evaluate transferability when model queries are limited.
9. Compare mitigations for robustness, latency, cost, and clean accuracy.
10. Add regression cases for credible attacks.
11. Document residual risk and operational compensating controls.

## Decision points
Use adversarial training only when the threat model and performance trade-off justify it. Prefer upstream validation or downstream policy controls when model-level robustness is insufficient. Do not equate one failed attack implementation with security.

## Common failure patterns
Testing only one attack; leaking labels into attack setup; unrealistic perturbation constraints; evaluating a defense with a non-adaptive attacker; ignoring downstream thresholds; reporting robustness without clean-performance impact.

## Verification
Re-run attacks from fixed configurations, validate attack implementation on known-vulnerable baselines, compare adaptive and non-adaptive results, and confirm mitigations reduce end-to-end security impact.

## Expected output
A threat-model-specific robustness report, reproducible attack suite, mitigation decision, and regression tests.

## Stop conditions
Stop when attacker capabilities are undefined, testing could affect production, attack tooling cannot be validated, or proposed mitigations exceed authorized product-risk decisions.