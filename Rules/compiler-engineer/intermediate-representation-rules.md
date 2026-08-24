# Intermediate Representation Rules

## Purpose
Protect compiler correctness through explicit IR contracts.

## Scope
High-, mid-, and low-level IRs and transformations between them.

## MUST
- Every IR level MUST define structural, typing, control-flow, and ownership invariants relevant to that level.
- Transformations MUST preserve required semantics and produce verifier-valid IR.
- Phase boundaries MUST document what information may be discarded.
- New IR constructs MUST define printing, parsing or serialization behavior when those facilities exist.

## MUST NOT
- MUST NOT rely on undocumented invariants that verifier or tests cannot detect.
- MUST NOT mutate shared IR in ways that invalidate analysis results without invalidation.
- MUST NOT encode target assumptions in target-independent IR without an explicit abstraction.

## SHOULD
- IRs SHOULD be minimal enough to make invariants reviewable.
- Debug dumps SHOULD be deterministic.

## Exceptions
Invariant relaxations require rationale, affected passes, verifier changes, tests, and approval.

## Verification
Run IR verifiers after transformations in test/debug configurations, round-trip tests where applicable, and randomized transformation tests.