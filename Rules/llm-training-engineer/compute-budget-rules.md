# Compute Budget Rules

## Purpose
Use scarce accelerator, energy, storage, and engineering capacity deliberately and measurably.

## Scope
Training runs, sweeps, ablations, failed-run recovery, checkpoint cadence, and large-scale experiments.

## MUST
- Large runs MUST have an approved compute budget, expected duration, checkpoint plan, and stop criteria.
- Expected resource use MUST be estimated before launch and actual use MUST be recorded.
- Costly experiments MUST define what decision the result will inform.
- Runaway cost, severe underutilization, or invalid training signals MUST trigger investigation and, where appropriate, termination.
- Scaling decisions MUST use observed throughput and convergence evidence from representative tests.

## MUST NOT
- MUST NOT continue a clearly invalid run solely because compute was already spent.
- MUST NOT launch redundant large sweeps when existing evidence can answer the question.
- MUST NOT claim efficiency gains without comparing equivalent useful work and model quality.

## SHOULD
- Sweeps SHOULD use staged allocation, early stopping, or proxy scales when valid.
- Teams SHOULD track tokens, accelerator-hours, energy/cost where available, and useful training throughput.

## Exceptions
Exploratory runs may have looser success criteria but still require bounded resource limits.

## Verification
Review budget approvals, scheduler requests, utilization telemetry, throughput, stop criteria, actual resource accounting, and experiment decisions.