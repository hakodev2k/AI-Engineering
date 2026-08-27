# Numerical Stability Rules

## Purpose
Prevent silent numerical error from changing financial outputs or system behavior.

## Scope
Applies to floating-point calculations, solvers, optimizers, matrix operations, simulations, and aggregations.

## MUST
- Algorithms MUST define acceptable numerical tolerances relative to business significance.
- Ill-conditioned operations, convergence criteria, overflow, underflow, NaN, infinity, and division-by-near-zero MUST be handled explicitly.
- Solver failures and non-convergence MUST propagate as observable failure states rather than plausible-looking values.
- Financial quantities requiring exact decimal semantics MUST use an appropriate representation.
- Changes to numerical libraries or algorithms MUST be regression-tested against validated reference cases.

## MUST NOT
- Exact equality on floating-point results MUST NOT be used where tolerance-based comparison is required.
- NaN or infinity MUST NOT silently enter positions, orders, limits, or reported risk.
- Arbitrary rounding MUST NOT be introduced without defined convention and impact assessment.

## SHOULD
- Prefer numerically stable formulations and scaled variables.
- Include adversarial boundary values in test suites.

## Exceptions
Exceptions require quantified error bounds, rationale, evidence that downstream decisions remain safe, and reviewer approval.

## Verification
Run reference-value tests, property tests, boundary tests, convergence diagnostics, cross-implementation comparisons, and static inspection for unsafe floating-point assumptions.