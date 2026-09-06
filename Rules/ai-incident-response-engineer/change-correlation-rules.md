# Change Correlation Rules

## Purpose
Use deployment and configuration history to accelerate investigation without confusing temporal correlation with causation.

## Scope
Applies to model, prompt, code, policy, data, index, dependency, infrastructure, and access changes near incident onset.

## MUST
- Investigators MUST establish an incident timeline and compare it with behavior-affecting changes.
- Change records MUST include sufficient identifiers to determine what version was active for affected traffic.
- Candidate changes MUST be tested against evidence before being labeled causal.
- Multiple simultaneous changes MUST be considered when their combined effects are plausible.
- Hidden or out-of-band production changes discovered during investigation MUST be documented and escalated as a control gap.
- Rollback experiments used to test causality MUST be risk-assessed and monitored.

## MUST NOT
- The most recent deployment MUST NOT automatically be declared root cause.
- Absence of an application-code deploy MUST NOT exclude model, prompt, data, provider, or configuration change.
- Responders MUST NOT alter history or records to simplify attribution.

## SHOULD
- Maintain a unified change timeline or correlation mechanism across AI stack layers.
- Automate version metadata into telemetry where feasible.

## Exceptions
When historical change metadata is unavailable, document the gap and use independent evidence to bound likely state.

## Verification
Inspect deployment records, model/prompt/configuration histories, audit logs, timeline correlation, and causal tests.