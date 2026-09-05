# Training Root-Cause Investigation Rules

## Purpose
Resolve training anomalies using evidence while avoiding speculative fixes that obscure the real failure.

## Scope
Loss spikes, divergence, quality regressions, throughput collapse, data anomalies, checkpoint corruption, and distributed failures.

## MUST
- Investigations MUST define the observed symptom, first known occurrence, affected runs, and comparison baseline.
- Hypotheses MUST be tested against available model, data, system, and code evidence.
- Broad corrective changes MUST wait until root cause is identified or bounded sufficiently to justify the intervention.
- Reproductions SHOULD be reduced to the smallest practical scale while preserving the failure mechanism.
- Fixes MUST include regression evidence demonstrating the symptom is removed without unacceptable new regressions.

## MUST NOT
- MUST NOT silently patch multiple suspected causes and call the incident resolved without attribution.
- MUST NOT discard anomalous logs, checkpoints, or data samples before evidence is preserved.
- MUST NOT treat temporal correlation as proof of causation.

## SHOULD
- Investigations SHOULD compare healthy and unhealthy runs at aligned steps and data positions.
- Findings SHOULD capture prevention and detection improvements, not only the immediate fix.

## Exceptions
Containment may precede root-cause proof when cost or safety exposure is high; containment must be labeled separately from resolution.

## Verification
Review incident timeline, preserved artifacts, hypotheses and falsification evidence, minimal reproductions, fix diff, regression tests, and post-fix runs.