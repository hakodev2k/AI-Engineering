# Portfolio Optimization Rules

## Purpose
Prevent optimizers from converting estimation noise or infeasible assumptions into concentrated financial decisions.

## Scope
Applies to allocation, hedging, execution scheduling, and constrained optimization.

## MUST
- Objective functions, constraints, units, bounds, and feasibility conditions MUST be explicit and testable.
- Optimization inputs MUST be validated for scale, conditioning, freshness, and estimation uncertainty.
- Solutions MUST be checked for feasibility after numerical tolerances and rounding.
- Turnover, transaction costs, liquidity, concentration, and operational constraints MUST be represented when material.
- Production changes MUST be sensitivity-tested against plausible perturbations in inputs and constraints.

## MUST NOT
- Solver success status MUST NOT alone establish economic validity.
- Unbounded, infeasible, or numerically unstable solutions MUST NOT be converted into orders.
- Tiny estimated advantages MUST NOT justify extreme allocations without robustness evidence.

## SHOULD
- Use regularization, robust optimization, or simpler allocations when estimation error dominates theoretical precision.
- Provide diagnostics explaining binding constraints and major allocation drivers.

## Exceptions
Exceptions require documented rationale, quantified risk, alternative considered, monitoring, and portfolio-owner approval.

## Verification
Run feasibility checks, perturbation tests, solver diagnostics, constraint audits, cost-aware comparisons, and scenario reviews of resulting positions.