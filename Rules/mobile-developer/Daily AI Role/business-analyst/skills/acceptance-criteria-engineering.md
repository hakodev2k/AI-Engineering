# Acceptance Criteria Engineering

## Purpose
Translate requirements into precise, testable acceptance criteria that preserve business intent.

## Trigger
Story refinement, feature definition, defect expected-behavior clarification, integration change, or release readiness review.

## Inputs
Approved requirement, business rules, actor/permission model, data constraints, edge cases, dependencies.

## Procedure
1. Identify the behavior under test and responsible actor.
2. Define preconditions and required state.
3. Write normal-path criteria.
4. Add boundary, invalid, permission, concurrency, timing, integration, and recovery cases when applicable.
5. State expected persisted state, emitted events/messages, user-visible behavior, and audit outcome where relevant.
6. Avoid implementation details unless they are contractual constraints.
7. Link every criterion to its parent requirement and business rule.
8. Ask QA/development to challenge ambiguity before approval.

## Outputs
Acceptance criteria set, edge-case matrix, unresolved questions, traceability links.

## Quality criteria
A tester can determine pass/fail without guessing business intent.

## Failure handling
If a criterion requires an unstated business decision, return it to the decision owner rather than encoding an assumption.

## Stop conditions
Stop when expected behavior is observable and all material branches are covered or explicitly deferred.