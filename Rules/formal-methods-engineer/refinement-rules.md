# Refinement Rules

## Purpose
Preserve verified properties as abstract specifications are transformed into more concrete designs and implementations.

## Scope
Applies to data refinement, behavioral refinement, simulation relations, refinement mappings, and stepwise implementation derivation.

## MUST
- Define the abstraction or refinement relation between adjacent levels explicitly.
- Prove or check that concrete behaviors allowed by the implementation correspond to permitted abstract behaviors.
- Identify newly introduced nondeterminism, state, timing, and failure modes at each refinement step.
- Re-establish affected invariants and temporal properties after refinement changes.
- Document which properties are preserved, strengthened, weakened, or outside the refinement argument.

## MUST NOT
- Assume implementation conformance because names or structures resemble the abstract model.
- Ignore stuttering, batching, retries, or internal transitions when they affect observable behavior.
- Claim end-to-end refinement when intermediate obligations remain unverified.

## SHOULD
- Keep refinement mappings small, explicit, and executable or mechanically checkable where practical.
- Separate functional refinement from performance or timing claims.

## Exceptions
Any deliberately weakened property requires documented rationale, residual risk, stakeholder impact, and approval before it is treated as acceptable.

## Verification
Use refinement proofs, simulation checks, trace comparison, model checking, implementation tests, and review of unproven obligations.