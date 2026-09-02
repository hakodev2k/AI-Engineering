# Worst-Case Execution Time Rules

## Purpose
Control execution-time uncertainty on deadline-sensitive paths.

## Scope
Worst-case execution time estimation, measurement, analysis, and regression control.

## MUST
- Critical tasks MUST have a defensible upper execution-time bound appropriate to the platform and assurance level.
- WCET evidence MUST account for caches, pipelines, memory contention, interrupts, compiler settings, and input-dependent paths where relevant.
- Changes that can affect execution time MUST trigger remeasurement or reanalysis before release.

## MUST NOT
- MUST NOT treat a single benchmark run or arithmetic mean as a worst-case bound.
- MUST NOT silently reuse stale WCET evidence after material hardware, compiler, runtime, or algorithm changes.

## SHOULD
- Keep measured headroom between demonstrated worst case and assigned execution budget.

## Exceptions
Statistical or measurement-only approaches require documented confidence limits, risk rationale, and approval when hard deadlines are involved.

## Verification
Review timing reports, benchmark harnesses, compiler/build settings, representative input sets, and CI regression thresholds.