# Inference Incident Response

## Purpose
Restore LLM inference service safely while preserving evidence for root-cause analysis.

## When to use
Use for availability loss, latency collapse, widespread OOM, corrupted outputs, model-loading failure, or fleet instability.

## Inputs
Incident symptoms, SLO dashboards, deployment history, logs/traces, fleet state, model/runtime versions, and runbooks.

## Context to inspect
Traffic gateway, queues, scheduler, replicas, artifact store, GPU health, recent changes, dependencies, and regional/failure-domain status.

## Core knowledge
Inference incidents often cascade: overload grows queues, retries multiply load, cache pressure causes OOM, and autoscaling may add cold replicas slowly. Stabilization precedes optimization.

## Procedure
1. Establish incident scope, affected versions/workloads, and client impact.
2. Freeze nonessential changes and identify the last known-good state.
3. Check saturation, error class, queue age, GPU health, and recent rollout correlation.
4. Contain with routing rollback, admission limits, traffic shedding, or isolation of unhealthy nodes.
5. Avoid retry amplification and preserve diagnostic evidence.
6. Validate recovery using client-visible SLOs, not process health alone.
7. Restore capacity gradually while monitoring recurrence signals.
8. Build a timeline and causal hypothesis after stabilization.
9. Create concrete prevention actions: tests, capacity limits, alerts, or rollout gates.

## Decision points
Rollback first when correlation with a recent change is strong and rollback is safe. Shed low-priority work before allowing total collapse. Replace suspect hardware when errors are device-specific.

## Common failure patterns
Restart loops, changing multiple knobs, clearing queues without controlling arrival rate, and declaring recovery before tail latency normalizes.

## Verification
Confirm sustained SLO recovery, stable queues/cache, healthy fleet, and no retry storm.

## Expected output
Recovered service, incident timeline, root cause or bounded hypotheses, and preventive actions.

## Stop conditions
Escalate immediately for suspected security compromise, data leakage, unsafe model behavior, or hardware failures requiring provider intervention.