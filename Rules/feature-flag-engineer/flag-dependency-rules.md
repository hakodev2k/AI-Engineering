# Flag Dependency Rules

## Purpose
Control interactions between flags and prevent combinatorial, cyclic, or hidden behavior.

## Scope
Prerequisites, mutually dependent flags, compound releases, and configuration graphs.

## MUST
- Flag dependencies MUST be explicit and acyclic.
- Compound behavior MUST define valid and invalid state combinations.
- Critical combinations MUST be covered by automated tests.
- Retirement planning MUST account for dependent flags.

## MUST NOT
- Code MUST NOT create undocumented implicit prerequisites between unrelated flags.
- Cyclic flag dependencies MUST NOT be introduced.
- Operators MUST NOT activate a dependent flag when prerequisites are unsatisfied.

## SHOULD
- Designs SHOULD minimize flag coupling.
- Dependency graphs SHOULD be machine-inspectable.

## Exceptions
Complex dependency structures require architecture review and evidence that simpler sequencing is insufficient.

## Verification
Inspect dependency graphs, static references, state-matrix tests, rollout plans, and registry metadata.