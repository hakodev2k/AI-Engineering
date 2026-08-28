# Incident Investigation Workflow

## Purpose
Use observability signals systematically to reduce time to scope, isolate, and explain production incidents.

## When to use
Use during active incidents, post-incident reconstruction, or when standardizing diagnostic workflows.

## Inputs
Incident symptoms, alerts, deployment history, logs, metrics, traces, topology, recent changes.

## Context to inspect
Inspect user impact, SLO state, correlated changes, service dependencies, saturation, error patterns, and trace exemplars.

## Core knowledge
Understand hypothesis-driven debugging, correlation versus causation, change analysis, distributed failure propagation, and evidence preservation.

## Procedure
1. Establish incident start time, impact, and affected users.
2. Confirm symptoms using independent signals.
3. Compare affected and healthy cohorts.
4. Check recent deployments, configuration, traffic, and dependency changes.
5. Use metrics to identify scope and onset.
6. Use traces to localize latency or failure propagation.
7. Use logs for detailed causal evidence.
8. Record hypotheses and disconfirming evidence.
9. Preserve evidence before retention or rolling state removes it.
10. Convert confirmed findings into remediation and observability gaps.

## Decision points
Mitigate before root-cause completion when customer impact is material. Prefer rollback or traffic reduction when evidence points to a recent reversible change.

## Common failure patterns
Searching logs without a hypothesis, anchoring on the first anomaly, confusing correlated errors with cause, and changing multiple variables simultaneously.

## Verification
Reproduce or explain the observed timeline, verify mitigation restores user indicators, and validate the root cause against multiple signals.

## Expected output
An evidence-backed incident timeline, root-cause statement, mitigation validation, and telemetry follow-ups.

## Stop conditions
Stop invasive diagnosis if production safety, permissions, or evidence integrity would be compromised.