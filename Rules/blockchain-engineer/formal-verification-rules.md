# Formal Verification

## Purpose
Apply formal methods where failure cost or state-space complexity warrants stronger assurance.

## Scope
Specifications, invariants, model checking, symbolic execution, theorem proving, and equivalence checks.

## MUST
- Express security-critical properties independently of the implementation when formal verification is used.
- Ensure the verified model matches deployed semantics, compiler assumptions, and relevant external behavior.
- Treat counterexamples as defects or explicitly resolved specification errors.
- Version specifications with the implementation they justify.
- Re-run applicable proofs/checks after material logic changes.

## MUST NOT
- Claim a contract is formally verified without naming the verified properties and assumptions.
- Treat verification of a simplified model as proof of unmodeled integrations.
- suppress unresolved counterexamples to meet release timelines.

## SHOULD
- Prioritize solvency, authorization, conservation, monotonicity, and state-machine properties.

## Exceptions
Skipping formal methods is acceptable when risk and complexity do not justify them; the decision should be documented for high-value protocols.

## Verification
Review specifications, tool outputs, assumptions, counterexample disposition, and correspondence between verified artifacts and deployed bytecode/source.