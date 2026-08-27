# Data Root Cause Analysis

## Purpose
Identify the technical and process causes of recurring or high-impact data failures using evidence rather than symptom-driven guessing.

## When to use
Use after significant incidents, repeated freshness or quality regressions, or failures with unclear ownership or multiple contributing systems.

## Inputs
Incident timeline, telemetry, logs, lineage, change history, data samples, source status, orchestration metadata, prior incidents.

## Preconditions
Preserve evidence and distinguish observed facts from hypotheses.

## Context to inspect
Inspect source generation, ingestion, transformations, storage, publication, schema changes, deployments, operational procedures, and dependency behavior.

## Core knowledge
Root cause is usually a causal chain, not the first visible failure. Senior analysis differentiates triggering event, latent weakness, detection gap, and organizational contributing factors.

## Procedure
1. Reconstruct a precise incident timeline.
2. Identify the earliest known deviation from expected behavior.
3. Traverse lineage upstream and downstream.
4. Correlate data symptoms with job, infrastructure, and change telemetry.
5. Form competing hypotheses.
6. Test each hypothesis against retained evidence.
7. Reproduce the failure safely when feasible.
8. Identify trigger, enabling conditions, detection gaps, and recovery gaps.
9. Define corrective actions at prevention, detection, and response layers.
10. Verify actions address the causal mechanism rather than the symptom.

## Decision points
Use five-whys only as a prompting technique, not proof. Prefer controlled reproduction when logs are ambiguous. Treat human error as a system-design signal rather than an endpoint.

## Common failure patterns
- Stopping at the first failed job
- Blaming upstream without evidence
- Confusing correlation with causation
- Writing generic actions such as "monitor better"
- Ignoring why existing controls failed

## Verification
Reproduce or simulate the causal path and demonstrate that proposed controls detect or prevent recurrence.

## Expected output
Evidence-backed causal analysis with prioritized preventive, detective, and recovery improvements.

## Stop conditions
Escalate when evidence is insufficient for a defensible conclusion or reproduction risks production data.