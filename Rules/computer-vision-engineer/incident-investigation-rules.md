# Incident Investigation Rules

## Purpose
Investigate production vision failures using preserved evidence and controlled hypotheses.

## Scope
Quality regressions, outages, false decisions, latency failures, drift, corrupted media, runtime incompatibility, and safety incidents.

## MUST
- Incidents MUST preserve relevant model version, runtime, configuration, input metadata, telemetry, and timeline subject to privacy constraints.
- Root-cause conclusions MUST be supported by reproducible evidence or explicitly marked as bounded hypotheses.
- Mitigations MUST distinguish immediate containment from permanent corrective action.
- Corrective changes MUST include regression evidence for the observed failure mode.

## MUST NOT
- Sensitive production imagery MUST NOT be copied into uncontrolled debugging locations.
- A model retrain MUST NOT be assumed to fix an incident without identifying the targeted failure mechanism.

## SHOULD
- Investigations SHOULD compare failing cases against nearby successful controls and prior model versions.

## Exceptions
When evidence cannot legally or technically be retained, document the limitation and use privacy-preserving metadata or controlled reproduction.

## Verification
Review incident timeline, artifact/version identifiers, evidence chain, reproduction, hypotheses, mitigations, and regression tests.