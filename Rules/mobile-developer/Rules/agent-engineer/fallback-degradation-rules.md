# Fallback and Degradation Rules
## Purpose
Keep agent systems safe when models, tools, or dependencies are unavailable or unreliable.
## Scope
Fallback models, degraded modes, dependency outages, and uncertainty handling.
## MUST
- Define safe behavior for unavailable tools, low-confidence evidence, provider failures, and exhausted budgets.
- Preserve authorization and safety guarantees when switching models or fallbacks.
- Clearly surface when requested work could not be completed or verified.
## MUST NOT
- Fabricate successful tool results during outages.
- Use a weaker fallback that violates required security, privacy, or capability constraints.
## SHOULD
- Prefer partial verified results or safe refusal over unsupported completion claims.
## Exceptions
Business-critical degraded modes require explicit risk acceptance and monitoring.
## Verification
Use dependency-failure tests, fallback evaluations, chaos tests, and user-visible failure review.