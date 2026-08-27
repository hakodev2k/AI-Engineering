# Text Generation Rules

## Purpose
Control generative NLP behavior with explicit quality, grounding, and failure policies.

## Scope
Generation parameters, constrained decoding, grounding, structured generation, factuality, and abstention.

## MUST
- Generation settings that materially affect output MUST be versioned with the deployed configuration.
- Factual or grounded tasks MUST define what evidence sources are authoritative and how unsupported claims are handled.
- Structured outputs MUST be parsed and schema-validated before automated consumption.
- Safety- or business-critical generation MUST have failure and escalation behavior for invalid or uncertain outputs.

## MUST NOT
- MUST NOT present generated content as verified fact without appropriate validation.
- MUST NOT rely on prompt wording alone as a hard security or authorization boundary.
- MUST NOT silently accept malformed structured output into downstream actions.

## SHOULD
- Decoding parameters SHOULD be tuned against task metrics and representative human evaluation.
- High-consequence workflows SHOULD prefer constrained outputs, retrieval evidence, or human review where practical.

## Exceptions
More permissive generation requires documented risk, bounded use, monitoring, and approval where consequences are material.

## Verification
Run factuality/grounding suites, schema tests, adversarial prompts, decoding reproducibility checks, safety evaluations, and sampled human review.