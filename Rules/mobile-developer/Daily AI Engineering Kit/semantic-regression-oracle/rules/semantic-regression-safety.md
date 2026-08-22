# Semantic Regression Safety Rules

## MUST
- Keep baseline and candidate bound to the same semantic scenario suite version/hash.
- Preserve evidence for every critical expected behavior.
- Treat invariant violations as blocking by default.
- Record every intentionally accepted behavior change with requirement or approval evidence.
- Distinguish `executed` from `verified`.
- Use an independent reviewer for critical or user-visible semantic changes.
- Keep retries bounded to one transient execution retry per scenario batch.

## MUST NOT
- Do not declare semantic compatibility only because unit/integration tests pass.
- Do not silently regenerate a baseline from the candidate implementation.
- Do not ignore volatile fields unless they are explicitly listed in the suite.
- Do not weaken an invariant to make a candidate pass without explicit evidence and approval.
- Do not compare results produced under materially different configuration while claiming equivalence.
- Do not execute destructive production actions to obtain comparison evidence.
- Do not treat missing evidence as proof of no regression.

## SHOULD
- Prefer observable business outputs/state over internal implementation details.
- Include historical examples for high-risk business logic.
- Use exact comparison where possible and explicit tolerances only where justified.
- Keep scenario sets focused on affected behavior but include adjacent invariants that could regress.
- Store comparison reports as reviewable artifacts in CI.