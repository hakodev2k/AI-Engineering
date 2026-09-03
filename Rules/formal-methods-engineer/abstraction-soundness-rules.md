# Abstraction Soundness Rules

## Purpose
Control abstraction so verification remains relevant to the concrete system and does not discard behaviors required for the claim.

## Scope
Applies to state reduction, data abstraction, environment abstraction, uninterpreted components, nondeterministic summaries, and compositional models.

## MUST
- Identify which concrete behaviors each abstraction preserves or over-approximates.
- Justify abstraction choices against the exact property class being verified.
- Review abstraction boundaries whenever a property fails or unexpectedly succeeds.
- Preserve adversarial and failure behaviors when they can affect safety or security claims.
- Record known false-positive and false-negative risks introduced by the abstraction technique.

## MUST NOT
- Remove behavior merely because it makes the state space difficult to verify.
- Under-approximate reachable behavior while claiming universal safety unless the limitation is explicit.
- Treat abstraction soundness as self-evident without a mapping or argument.

## SHOULD
- Prefer conservative over-approximation for safety properties when practical.
- Validate abstractions against small concrete instances or differential executions.

## Exceptions
An intentionally incomplete abstraction requires documented scope limits, residual risk, and explicit prohibition on broader assurance claims.

## Verification
Review abstraction mappings, compare concrete and abstract traces, run bounded concrete checks, inspect property preservation arguments, and test known edge scenarios.