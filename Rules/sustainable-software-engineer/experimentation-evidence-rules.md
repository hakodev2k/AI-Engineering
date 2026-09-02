# Sustainability Experimentation and Evidence Rules

## Purpose
Ensure sustainability interventions are evaluated with evidence strong enough to support engineering decisions.

## Scope
Applies to benchmarks, prototypes, controlled experiments, configuration trials, architecture comparisons, and production evaluations.

## MUST
- Experiments MUST state the hypothesis, success metric, workload, environment, comparison method, and known confounders before conclusions are accepted.
- Before/after measurements MUST use equivalent conditions or explicitly normalize material differences.
- Changes with production risk MUST define abort criteria and rollback before execution.
- Conclusions MUST separate observed evidence from inference.

## MUST NOT
- MUST NOT generalize a microbenchmark result to system-wide impact without validating the relevant end-to-end path.
- MUST NOT select only favorable runs while ignoring representative adverse results.
- MUST NOT run disruptive production experiments without explicit human approval.

## SHOULD
- Repeat measurements enough to characterize meaningful variability.
- Prefer production-like datasets and traffic shapes when privacy and safety permit.
- Record negative results when they prevent repeated low-value work.

## Exceptions
Exceptions require the unavailable control, expected bias, risk, alternative evidence, and reviewer acceptance.

## Verification
Review experiment plans, raw measurements, benchmark configuration, statistical summaries where appropriate, deployment records, rollback criteria, and reproducibility notes.
