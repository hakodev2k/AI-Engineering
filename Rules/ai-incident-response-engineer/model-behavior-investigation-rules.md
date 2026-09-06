# Model Behavior Investigation Rules

## Purpose
Investigate anomalous AI behavior rigorously despite probabilistic and version-dependent model outputs.

## Scope
Applies to hallucination, refusal, unsafe behavior, instruction-following failures, output drift, regressions, and other model-mediated incidents.

## MUST
- Investigation MUST identify the exact model/version or deployment identifier when available.
- Reproduction MUST preserve relevant system instructions, user inputs, context, sampling settings, tool definitions, and model routing conditions.
- Probabilistic failures MUST be tested across enough repeated samples to estimate recurrence when severity depends on frequency.
- Investigators MUST separate model behavior from failures introduced by preprocessing, retrieval, orchestration, tools, post-processing, or UI presentation.
- Behavioral comparisons MUST use controlled inputs and documented evaluation criteria.
- Material differences between historical and current model behavior MUST be identified when reproduction uses a changed model.

## MUST NOT
- A single successful retry MUST NOT be treated as proof that a reported probabilistic failure is resolved.
- Model output MUST NOT be assumed deterministic unless the serving stack guarantees the relevant conditions.
- Safety or correctness claims MUST NOT rely only on subjective inspection when testable criteria can be defined.

## SHOULD
- Use curated regression cases and automated evaluation for recurring behavior classes.
- Preserve representative failing examples with appropriate privacy controls.

## Exceptions
When exact historical replay is impossible, investigators must document the mismatch and use the closest defensible reconstruction without claiming equivalence.

## Verification
Inspect reproduction harnesses, version metadata, repeated-run results, evaluation criteria, and layer-by-layer isolation evidence.