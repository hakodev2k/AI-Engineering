# Data Quality Root Cause Analysis

## Purpose
Identify the causal mechanism behind a data defect and distinguish root cause from downstream symptoms and contributing conditions.

## When to use
Use after containment of material incidents or recurring quality failures.

## Inputs
Incident timeline, code/config changes, lineage, logs, metrics, data samples, orchestration history, and source-system evidence.

## Preconditions
Preserve evidence and establish a bounded incident scope.

## Context to inspect
Inspect first bad partition/event, last known good state, deployment timeline, retries, dependencies, schema changes, manual operations, and environmental changes.

## Core knowledge
A root cause must explain observed evidence and failure propagation. Human error alone is rarely an adequate engineering cause; system conditions that permitted or failed to detect the error matter.

## Procedure
1. Build a timestamped fact timeline.
2. Identify earliest observable divergence.
3. Trace upstream from the first bad output.
4. Compare bad and good executions.
5. Form competing hypotheses.
6. Test hypotheses using reproducible evidence.
7. Identify trigger, causal mechanism, and contributing controls failure.
8. Explain propagation to consumers.
9. Identify why detection did not occur earlier.
10. Define corrective and preventive actions at appropriate layers.
11. Validate actions against the failure mechanism.

## Decision points
Use five-whys only as a prompt, not proof. Prefer causal evidence from controlled comparison or reproduction. Separate primary cause from factors that increased blast radius or detection delay.

## Common failure patterns
Stopping at the first code bug; blaming an operator; chronology mistaken for causality; changing multiple variables during reproduction; prevention actions unrelated to the mechanism; no detection-gap analysis.

## Verification
The proposed cause predicts observed symptoms, can be reproduced or strongly evidenced, and the fix prevents recurrence under a representative test.

## Expected output
A concise causal narrative, evidence, contributing factors, detection gaps, and verified corrective actions.

## Stop conditions
Stop assigning causality when evidence is insufficient or contradictory; preserve uncertainty and escalate for additional telemetry or expertise.