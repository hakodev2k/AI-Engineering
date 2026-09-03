# Model Checking Rules

## Purpose
Use exhaustive or systematically bounded state exploration to find property violations with trustworthy configuration and evidence.

## Scope
Applies to explicit-state, symbolic, bounded, probabilistic, and temporal model checking.

## MUST
- Record model checker version, configuration, bounds, reductions, and assumptions used for material verification claims.
- Verify critical properties under representative failure and concurrency behaviors.
- Preserve reproducible counterexample traces for defects and disputed results.
- Distinguish exhaustive verification from bounded exploration in reports.
- Re-run affected properties after semantic model changes.

## MUST NOT
- Describe bounded success as proof beyond the explored bound.
- Enable reductions that are unsound for the property class being checked.
- Suppress counterexamples without root-cause classification.
- Treat state-space exhaustion caused by resource limits as verification success.

## SHOULD
- Use symmetry, partial-order reduction, abstraction, and slicing only with documented soundness expectations.
- Automate repeatable model-checking runs in CI when execution cost permits.

## Exceptions
Resource-driven reductions or bounds require documented coverage limits, residual risk, and reviewer acceptance for critical claims.

## Verification
Inspect checker logs, state counts, bounds, property results, counterexample artifacts, reproducible commands, and CI outputs.