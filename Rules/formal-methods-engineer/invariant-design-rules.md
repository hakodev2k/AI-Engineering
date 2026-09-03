# Invariant Design Rules

## Purpose
Define invariants that express critical truths the system must preserve across all reachable states.

## Scope
Applies to data integrity, authorization, protocol state, resource ownership, uniqueness, consistency, and safety invariants.

## MUST
- Express invariants over all relevant reachable states, not only nominal workflows.
- Tie each critical invariant to a concrete failure consequence and owning requirement.
- Verify invariant preservation for every transition capable of modifying related state.
- Include initialization conditions sufficient to establish each invariant.
- Investigate any counterexample before weakening the invariant or restricting the model.

## MUST NOT
- Encode a desired invariant as an unchecked model assumption.
- Exclude failure, retry, concurrency, or recovery transitions when they can violate the invariant.
- Weaken an invariant solely to make verification complete.

## SHOULD
- Prefer small composable invariants whose conjunction explains the larger safety claim.
- Separate structural invariants from temporal properties.

## Exceptions
A relaxed invariant requires documented rationale, affected scenarios, compensating controls, and approval when the change can affect safety, security, or data integrity.

## Verification
Use inductive proof, model checking, transition coverage review, mutation of transitions, and counterexample analysis to demonstrate establishment and preservation.