# Reliability Rules

## Purpose
Ensure growth systems fail safely and do not compromise core customer journeys.

## Scope
Growth APIs, experimentation services, analytics dependencies, personalization, campaigns, and third-party integrations.

## MUST
- Define failure behavior, timeout, retry, idempotency, and fallback for dependencies on critical journeys.
- Make duplicate processing safe for economically or behaviorally significant actions.
- Monitor availability and error rates for growth components that can block core flows.

## MUST NOT
- Let optional analytics or personalization failures prevent essential product actions unless explicitly required.
- Retry non-idempotent operations blindly.

## SHOULD
- Degrade to a safe default experience when growth dependencies are unavailable.

## Exceptions
Hard dependency is acceptable only when business correctness requires it and failure handling is explicit.

## Verification
Use failure injection, integration tests, timeout/retry inspection, duplicate-event tests, monitoring, and incident evidence.