# ML Platform Production Debugging

## Purpose
Systematically isolate failures across orchestration, compute, storage, networking, data, artifacts, model runtime, and deployment layers.

## When to use
Use for failed training jobs, stuck pipelines, serving crashes, artifact load failures, intermittent GPU issues, or environment-specific defects.

## Inputs
Symptoms, timestamps, run IDs, model/artifact versions, logs, metrics, traces, scheduler events, recent changes.

## Preconditions
Enough identifiers exist to correlate the failing execution across systems.

## Context to inspect
Orchestrator events, container logs, node health, quotas, object store, registry, network/DNS, IAM, drivers, dependency versions, and recent deployments.

## Core knowledge
Start from observed evidence and narrow layer by layer. ML failures frequently masquerade: OOM can be a data-shape change, timeout can be storage throttling, model error can be artifact corruption, and random job failure can be preemption.

## Procedure
1. Define exact failure signature and first bad time.
2. Compare with last known-good execution.
3. Correlate run, pod/job, node, artifact, and dataset identifiers.
4. Check recent configuration/code/data/platform changes.
5. Inspect resource exhaustion and scheduler events.
6. Validate storage/network/IAM dependencies.
7. Reproduce with the smallest faithful workload.
8. Change one variable at a time.
9. Apply minimal remediation and verify at production-like scale.
10. Add regression detection or runbook updates.

## Decision points
Reproduce locally only when environment differences are controlled; otherwise use isolated target-like staging. Roll back before root cause when impact is active and rollback is safe.

## Common failure patterns
Random restarts without evidence, increasing resources blindly, deleting failed pods/logs, ignoring data-version changes, and debugging latest code instead of failing artifact.

## Verification
Reproduce the original failure or establish strong causal evidence, then demonstrate the fix removes it without new regressions.

## Expected output
Failure timeline, root cause, evidence, remediation, verification, and preventive control.

## Stop conditions
Escalate hardware/driver instability, security indicators, data corruption, or destructive recovery requirements.