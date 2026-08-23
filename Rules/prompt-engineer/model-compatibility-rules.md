# Model Compatibility Rules

## Purpose
Keep prompt behavior stable across model and runtime changes.

## Scope
Model upgrades, model-family substitutions, provider changes, parameter changes, and capability changes.

## MUST
- Prompt behavior MUST be re-evaluated when the underlying model or materially relevant runtime changes.
- Model-specific assumptions MUST be documented when they affect correctness, safety, latency, or formatting.
- Fallback models MUST be tested against the same critical contracts before use.
- Capability differences such as tool use, context limits, structured outputs, and reasoning behavior MUST be reflected in prompt design.

## MUST NOT
- MUST NOT assume a prompt proven on one model is equivalent on another.
- MUST NOT silently downgrade to a model that fails required safety or output guarantees.
- MUST NOT encode undocumented provider-specific quirks as permanent business logic.

## SHOULD
- Prompts SHOULD minimize unnecessary model-specific coupling.
- Compatibility evaluations SHOULD include representative and adversarial cases.

## Exceptions
A temporary model substitution may be allowed for low-risk degradation paths with bounded scope, monitoring, and owner approval.

## Verification
Compare evaluation results across supported models, inspect fallback behavior, and review documented model-specific assumptions.