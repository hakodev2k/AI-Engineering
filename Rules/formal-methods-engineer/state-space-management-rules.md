# State Space Management Rules

## Purpose
Control state-space growth without invalidating the properties or assurance claims under verification.

## Scope
Applies to bounding, slicing, symmetry reduction, partial-order reduction, abstraction, decomposition, and parameterized verification.

## MUST
- Record every bound and reduction that can affect reachable behaviors or property coverage.
- Justify why each reduction preserves the property class being verified.
- Distinguish resource exhaustion from successful completion.
- Re-run critical properties with alternative bounds or abstractions when results are sensitive to configuration.
- Preserve representative failure, concurrency, and boundary behaviors during reduction.

## MUST NOT
- Remove difficult states solely to make verification terminate.
- Claim unbounded correctness from bounded exploration without a valid cutoff or proof argument.
- Hide state-space truncation, timeout, or search incompleteness in verification summaries.

## SHOULD
- Measure state growth before and after reductions to understand their effect.
- Prefer compositional verification when component contracts can be justified independently.

## Exceptions
Incomplete exploration may be accepted only with explicit scope limits, residual-risk documentation, and reviewer approval for consequential claims.

## Verification
Inspect checker statistics, bounds, reduction settings, explored-state counts, cutoff arguments, alternate runs, and configuration diffs.