# Saturation Root Cause Analysis

## Purpose
Diagnose why an AI system reached capacity limits and identify whether the true cause is demand, configuration, fragmentation, software efficiency, dependency limits, or insufficient supply.

## When to use
Use after latency collapse, queue growth, OOM events, throttling, training backlog, or emergency scale-out.

## Inputs
Incident timeline, demand metrics, utilization, queue depth, model/token mix, scheduler events, autoscaling history, quotas, deployment changes, hardware health.

## Preconditions
Preserve incident telemetry and distinguish pre-incident baseline from degraded behavior.

## Context to inspect
Inference engine, scheduler, retries, batch efficiency, memory pressure, network/storage, provider quota, model rollout, autoscaling, regional routing.

## Core knowledge
Saturation is a symptom. More hardware can mask retry storms, memory leaks, poor batching, bad routing, stranded capacity, or a sudden workload-shape change without removing the root cause.

## Procedure
1. Define the first violated capacity or SLO signal.
2. Reconstruct demand and supplied capacity over time.
3. Compare request count, tokens, sequence length, and concurrency.
4. Identify the first resource or queue to saturate.
5. Check recent model, prompt, routing, and software changes.
6. Quantify retries, failures, and amplification.
7. Inspect fragmentation and unavailable capacity.
8. Test competing root-cause hypotheses.
9. Separate immediate containment from permanent correction.
10. Update planning assumptions and alerts.

## Decision points
Scale immediately when harm is ongoing, but continue analysis until the causal driver is understood. Prefer efficiency fixes when they recover material sustainable capacity.

## Common failure patterns
Declaring high GPU utilization the root cause, ignoring workload-shape changes, buying capacity before checking retries, and using averages that hide one saturated pool.

## Verification
A replay, controlled experiment, or post-fix measurement demonstrates that the identified cause explains the saturation and the correction increases sustainable headroom.

## Expected output
An evidence-backed saturation RCA with recovered capacity, corrective actions, and revised thresholds.

## Stop conditions
Escalate when production evidence is missing or remediation requires high-risk architectural changes.