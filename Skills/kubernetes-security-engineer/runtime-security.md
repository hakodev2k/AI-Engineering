# Runtime Security

## Purpose
Detect and contain malicious or anomalous behavior in running Kubernetes workloads and nodes.

## When to use
Use for production detection design, sensitive workloads, incident readiness, or validating preventive controls.

## Inputs
Threat model, workload behavior, runtime telemetry, container/runtime capabilities, alerting platform, and response ownership.

## Preconditions
Establish baseline behavior and an incident path before enabling high-volume detections.

## Context to inspect
Inspect process execution, file changes, network connections, privilege changes, container escapes, namespace entry, package execution, shells, sensitive mounts, and Kubernetes audit context.

## Core knowledge
Runtime detection complements prevention; it cannot compensate for unrestricted privilege. High-value detections connect process/network behavior to workload identity and deployment context.

## Procedure
1. Prioritize threat behaviors from the cluster threat model.
2. Identify telemetry capable of observing them.
3. Baseline legitimate workload behavior.
4. Implement high-signal detections first.
5. Enrich alerts with pod, namespace, image digest, node, and owner.
6. Define containment actions and authorization.
7. Test detections with safe simulations.
8. Tune false positives without suppressing whole behavior classes.
9. Review coverage after platform changes.

## Decision points
Use prevention for deterministic forbidden behavior; detection for context-dependent or unavoidable behavior. Automate containment only when false-positive impact is acceptable.

## Common failure patterns
Alerting on generic shells everywhere; missing workload identity; no response owner; collecting telemetry without retention/searchability; auto-killing critical pods on weak signals.

## Verification
Execute controlled test behaviors and verify telemetry, alert routing, enrichment, and response playbooks.

## Expected output
A tested runtime detection set mapped to threats and response actions.

## Stop conditions
Escalate active escape, credential theft, cryptomining, persistence, or control-plane targeting indicators.