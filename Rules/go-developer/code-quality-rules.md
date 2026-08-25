# Code Quality Rules

## Purpose
Keep Go systems understandable and safe to evolve under production constraints.

## Scope
Maintainability, complexity, duplication, refactoring, naming, and reviewability.

## MUST
- Complex logic MUST expose clear invariants and failure behavior.
- Refactoring MUST preserve externally observable behavior unless a behavior change is intentional and tested.
- Repeated logic that encodes the same business invariant MUST have a deliberate ownership strategy.
- Changes MUST remain small enough to review effectively or be decomposed with a documented migration plan.

## MUST NOT
- MUST NOT introduce abstraction whose indirection exceeds demonstrated reuse or boundary value.
- MUST NOT suppress static-analysis findings without a reason tied to the specific finding.
- MUST NOT mix broad cleanup with high-risk behavior changes when separation is practical.

## SHOULD
- Prefer straightforward control flow and explicit dependencies.
- Keep functions focused on one coherent responsibility without arbitrary size rules.

## Exceptions
Generated or performance-critical code may trade readability for constraints; document generation source or measured need.

## Verification
`gofmt`, `go vet`, static analysis, tests, complexity/review inspection, and diff-based behavioral review.