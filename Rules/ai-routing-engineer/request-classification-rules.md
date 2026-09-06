# Request Classification Rules

## Purpose
Classify requests accurately enough to select appropriate model, provider, policy, and resource paths.

## Scope
Task taxonomy, modality, sensitivity, risk, complexity, language, tool requirements, and classification confidence.

## MUST
- Classification features used for routing MUST be defined and versioned.
- Security, privacy, and high-risk classifications MUST fail safely when uncertain.
- Classification changes MUST be evaluated against representative production traffic before rollout.
- Classification output MUST preserve the information needed to explain route selection.
- Misclassification incidents affecting correctness or safety MUST produce regression coverage.

## MUST NOT
- MUST NOT route sensitive traffic using untrusted user labels as the sole classification evidence.
- MUST NOT silently coerce unknown request types into privileged or less-restricted routes.
- MUST NOT use protected or sensitive attributes for optimization unless explicitly justified and permitted.

## SHOULD
- Use confidence thresholds and explicit unknown classes where ambiguity is meaningful.
- Keep taxonomies stable enough for monitoring and historical comparison.

## Exceptions
Exceptions require documented scope, risk, evidence, and approval.

## Verification
Review classifier tests, confusion analysis, policy edge cases, decision logs, and regression suites.