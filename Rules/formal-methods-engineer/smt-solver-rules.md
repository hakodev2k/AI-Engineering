# SMT Solver Rules

## Purpose
Use SMT solvers with explicit theories, reproducible constraints, and defensible interpretation of solver outcomes.

## Scope
Applies to satisfiability modulo theories, symbolic execution backends, constraint solving, proof obligations, and verification conditions.

## MUST
- Record solver version, relevant options, timeout policy, and logical theories for material results.
- Distinguish `sat`, `unsat`, `unknown`, timeout, and tool failure in reports.
- Validate that encodings preserve intended integer, bit-vector, floating-point, array, and memory semantics.
- Inspect models or unsat cores when they materially affect a decision.
- Reproduce critical results independently when solver instability or unsupported features are suspected.

## MUST NOT
- Treat `unknown` or timeout as success.
- Substitute mathematical integers for bounded machine arithmetic when overflow behavior matters.
- Rely on solver-specific undefined behavior without documenting it.
- Assume a solver model is meaningful beyond the encoded constraints.

## SHOULD
- Minimize constraints before escalating suspected solver defects.
- Use solver-independent encodings where portability is important.

## Exceptions
Nonstandard solver features require documented rationale, portability impact, and validation evidence.

## Verification
Review generated constraints, solver transcripts, models, unsat cores, theory selections, replay commands, and differential results from alternate solvers where appropriate.