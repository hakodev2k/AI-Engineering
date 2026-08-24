# Search Experimentation

## Purpose
Use online experiments without sacrificing safety, interpretability, or statistical validity.

## Scope
A/B tests, interleaving, feature flags, ramping, guardrails, and experiment analysis.

## MUST
- State hypothesis, primary metric, guardrails, population, and stopping criteria before reading results.
- Isolate experiment assignment consistently for the intended unit.
- Guard critical latency, error, safety, and business constraints during relevance experiments.
- Retain configuration sufficient to reproduce each treatment.

## MUST NOT
- Repeatedly peek and stop on favorable noise without an approved sequential method.
- ramp a treatment after guardrail breaches without explicit review.
- infer causality from uncontrolled before/after traffic changes.

## SHOULD
- Ramp progressively when blast radius is material.
- Analyze heterogeneous effects across important query and user segments.

## Exceptions
Exceptions require methodological limitations, alternative evidence, and decision-maker approval.

## Verification
Review experiment design, assignment logs, power/sample reasoning, guardrails, treatment configs, and analysis notebooks/reports.