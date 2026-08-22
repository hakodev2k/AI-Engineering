# Model Explainability

## Purpose
Provide fit-for-purpose explanations of model behavior for engineers, operators, reviewers, and affected decision processes.

## When to use
When debugging, validating, auditing, supporting human decisions, or satisfying interpretability requirements.

## Inputs
Model, features, predictions, reference data, audience, decision context, explanation requirements.

## Context to inspect
Model family, feature semantics/correlation, causal assumptions, stakeholder needs, regulatory constraints.

## Core knowledge
Feature attribution describes model behavior, not necessarily causal effects. Global and local explanations answer different questions. Correlated features can destabilize attribution.

## Procedure
1. Define the audience and question the explanation must answer.
2. Use intrinsic model structure when sufficient.
3. Select local/global methods appropriate to model and data.
4. Establish a meaningful reference/background dataset.
5. Test explanation stability across nearby samples and correlated features.
6. Compare explanations with known domain behavior.
7. Communicate limitations and non-causal interpretation.
8. Store explanation configuration with model version.

## Decision points
Prefer simpler interpretable models when explanation is a hard requirement and performance trade-off is acceptable. Use post-hoc methods when complexity is justified and limitations are understood.

## Common failure patterns
Presenting attribution as causality, using arbitrary baselines, unexplained encoded features, and trusting visually plausible plots without validation.

## Verification
Explanations respond predictably to controlled feature/model changes and domain reviewers can interpret them correctly.

## Expected output
Validated explanation artifacts with audience-specific interpretation and limitations.

## Stop conditions
Do not claim causal explanations without causal design/evidence.