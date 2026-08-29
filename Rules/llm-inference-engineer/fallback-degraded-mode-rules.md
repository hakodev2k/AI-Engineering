# Fallback and Degraded Mode Rules

## Purpose
Keep inference services useful and safe when preferred models, capacity, or dependencies are unavailable.

## Scope
Applies to model fallback, reduced context, reduced features, alternate regions, cached responses, rejection, and partial service modes.

## MUST
- Every critical inference service MUST define acceptable behavior when its preferred model or serving pool is unavailable.
- Fallback models MUST be explicitly approved for the request classes they may serve.
- Degraded modes MUST identify changes in capability, quality, context length, latency, and safety behavior.
- Routing into fallback MUST be observable and reversible.
- If no safe fallback exists, the service MUST fail explicitly rather than silently producing unsupported behavior.

## MUST NOT
- MUST NOT substitute a materially different model without tracking the substitution.
- MUST NOT bypass safety, authorization, or data-handling controls to preserve availability.
- MUST NOT advertise capabilities that the degraded path cannot provide.

## SHOULD
- Fallback paths SHOULD be exercised regularly through tests or controlled drills.
- User-facing systems SHOULD communicate material capability degradation when appropriate.

## Exceptions
Emergency degradation requires incident context, bounded scope, explicit risk acceptance, and restoration criteria.

## Verification
Inspect fallback routing, model-compatibility records, incident runbooks, test results, telemetry labels, and restoration procedures.