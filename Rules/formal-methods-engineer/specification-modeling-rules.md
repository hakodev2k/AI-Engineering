# Specification Modeling Rules

## Purpose
Define precise formal models that capture intended system behavior without silently encoding implementation accidents.

## Scope
Applies to state machines, transition systems, temporal models, algebraic specifications, process models, and executable formal specifications.

## MUST
- State modeled entities, state variables, transitions, assumptions, invariants, and observable outcomes explicitly.
- Separate environment assumptions from system guarantees.
- Define initial states and invalid states explicitly where the formalism permits.
- Keep model abstractions traceable to real requirements or architecture decisions.
- Review every omitted implementation detail to determine whether the omission can affect a claimed property.

## MUST NOT
- Treat an underspecified model as proof of the implemented system.
- Encode desired outcomes as assumptions merely to make verification succeed.
- Hide undefined behavior behind unconstrained variables without documenting the consequence.
- Conflate implementation convenience with system semantics.

## SHOULD
- Prefer the smallest abstraction that still preserves the properties being verified.
- Use naming that maps clearly to domain concepts and verification claims.

## Exceptions
Any deliberate abstraction that removes behavior relevant to a property requires documented rationale, impact analysis, and reviewer approval.

## Verification
Verify by peer review of model-to-requirement traceability, assumption/guarantee inspection, property coverage, counterexample review, and comparison against implementation or reference scenarios.