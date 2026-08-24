# Capacity Incident Learning Rules
## Purpose
Convert saturation and exhaustion incidents into stronger planning controls.
## Scope
Capacity-related incidents, near misses, throttling, quota exhaustion, and overload degradation.
## MUST
- Capacity incidents MUST identify which assumption, signal, threshold, action, or lead time failed.
- Corrective actions MUST update models, monitoring, thresholds, or process rather than only add emergency capacity.
- Conclusions MUST be supported by logs, metrics, traces, configuration, or equivalent evidence.
## MUST NOT
- MUST NOT label demand as unexpected when known signals existed but were ignored.
- MUST NOT treat added capacity as root-cause remediation when amplification or inefficiency remains.
## SHOULD
- Near misses SHOULD receive the same model review as incidents when blast radius was credible.
## Exceptions
Unresolved root cause requires bounded hypotheses and follow-up ownership.
## Verification
Review incident timelines, evidence, action closure, and subsequent forecast accuracy.