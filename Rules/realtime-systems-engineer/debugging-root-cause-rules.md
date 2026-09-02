# Debugging and Root-Cause Rules

## Purpose
Ensure timing failures are investigated with evidence rather than guesswork.

## Scope
Deadline misses, jitter, hangs, overruns, races, priority inversion, and intermittent timing defects.

## MUST
- Investigations MUST preserve the failing timing context, workload, configuration, hardware, and software versions when available.
- Root-cause analysis MUST distinguish symptom, contributing factors, and verified causal mechanism.
- Instrumentation added for diagnosis MUST have its timing perturbation understood when conclusions depend on precise latency.
- Corrective changes MUST include regression evidence for the failure mode they address.

## MUST NOT
- MUST NOT attribute intermittent real-time failures solely to 'load' without evidence identifying the responsible contention or timing path.
- MUST NOT suppress deadline alarms or increase timeouts as a substitute for understanding the cause when safety or correctness is affected.

## SHOULD
- Reproduce failures with progressively isolated hypotheses using scheduler traces, hardware traces, counters, and controlled load.

## Exceptions
When reproduction is impractical, conclusions require bounded hypotheses, operational evidence, risk assessment, and monitoring for recurrence.

## Verification
Review incident evidence, traces, hypotheses, reproduction steps, causal tests, regression tests, and post-fix timing measurements.