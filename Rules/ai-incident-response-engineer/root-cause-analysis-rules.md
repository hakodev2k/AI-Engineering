# Root Cause Analysis Rules

## Purpose
Identify causal mechanisms and contributing conditions with evidence sufficient to prevent recurrence.

## Scope
Applies to investigation of model, prompt, agent, retrieval, data, infrastructure, integration, policy, deployment, and process failures.

## MUST
- Root-cause conclusions MUST be supported by reproducible evidence, telemetry, controlled tests, configuration inspection, or equivalent validation.
- Investigation MUST distinguish trigger, root cause, contributing factors, detection gaps, and impact amplifiers.
- Changes in model, prompt, retrieval data, tool configuration, dependencies, or infrastructure around incident onset MUST be considered when relevant.
- Non-deterministic behavior MUST be investigated with repeated trials or statistical evidence rather than a single replay.
- Unresolved causal uncertainty MUST be documented with bounded hypotheses and next evidence needed.
- Human and process factors MUST be evaluated without substituting blame for technical causality.

## MUST NOT
- Correlation MUST NOT be reported as proven causation without validation.
- The first plausible explanation MUST NOT terminate investigation when material evidence conflicts with it.
- AI-generated diagnostic narratives MUST NOT be accepted without independent evidence.

## SHOULD
- Prefer the simplest causal model consistent with all material evidence.
- Counterfactual or fault-injection testing SHOULD be used when safe and useful.

## Exceptions
When complete root cause cannot be established, a bounded causal assessment may close the incident only with documented residual uncertainty and approved follow-up.

## Verification
Review RCA evidence, reproduction steps, experiments, timelines, and remediation mapping. Confirm each claimed cause has supporting evidence and corrective action addresses causal mechanisms.