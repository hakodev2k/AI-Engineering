# Documentation Rules

## Purpose
Keep contract documentation accurate enough for independent consumer implementation and review.

## Scope
Applies to contract descriptions, examples, lifecycle notes, ownership, guarantees, and migration guidance.

## MUST
- Documentation MUST describe semantics, ownership, version status, compatibility expectations, quality guarantees, and known limitations relevant to consumers.
- Examples MUST conform to the active contract and MUST NOT normalize invalid states.
- Documentation changes that alter semantics MUST receive the same review as the underlying contract change.
- Deprecated or superseded guidance MUST be clearly marked.

## MUST NOT
- Documentation MUST NOT claim guarantees that production systems do not enforce or measure.
- Critical behavior MUST NOT exist only in informal chat, tickets, or tribal knowledge.
- Consumers MUST NOT be required to inspect producer source code to discover basic contract semantics.

## SHOULD
- Documentation SHOULD be generated from machine-readable contract metadata where practical.
- Migration guides SHOULD include before-and-after examples for breaking transitions.

## Exceptions
Exceptions require a documented gap, affected consumers, owner, and remediation target.

## Verification
Compare documentation with schemas, validation logic, monitoring, sample records, and active versions. Review stale references and broken examples in CI where feasible.