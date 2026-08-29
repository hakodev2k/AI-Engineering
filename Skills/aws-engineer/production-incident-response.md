# Production Incident Response

## Purpose
Diagnose and mitigate AWS production incidents methodically while minimizing further impact and preserving evidence.

## When to use
Use during outages, latency spikes, throttling, failed deployments, security-impacting service degradation, or unknown AWS failures.

## Inputs
Incident symptoms, timeline, affected services/users, recent changes, logs, metrics, traces, CloudTrail, AWS Health events.

## Preconditions
Use approved incident command and access paths. Prefer reversible mitigation over speculative permanent changes.

## Context to inspect
CloudWatch, service metrics, application logs, deployment history, CloudTrail, quotas, load balancers, autoscaling, dependencies, AWS Health Dashboard.

## Core knowledge
Senior incident response separates mitigation from diagnosis, tests hypotheses against evidence, controls blast radius, and records decisions. AWS incidents frequently combine quota, dependency, network, IAM, scaling, or deployment factors.

## Procedure
1. Establish incident severity, scope, and commander.
2. Freeze unrelated changes.
3. Build a precise timeline from telemetry and deployments.
4. Identify the failing user journey and dependency edge.
5. Form ranked hypotheses from evidence.
6. Apply the safest reversible mitigation with explicit expected signal.
7. Measure whether impact improves.
8. Continue diagnosis after stabilization.
9. Preserve relevant logs/config snapshots.
10. Produce corrective actions addressing root and contributing causes.

## Decision points
Rollback when a recent change strongly correlates and rollback is safe. Scale only when saturation evidence supports it. Fail over only when the target environment is known healthy.

## Common failure patterns
Random config changes, scaling without evidence, deleting resources during investigation, no timeline, alert fixation, and declaring root cause from correlation alone.

## Verification
Confirm customer-facing recovery, stabilized leading indicators, and that the causal mechanism is reproducible or strongly evidenced.

## Expected output
Mitigation record, root-cause analysis, evidence, and prioritized corrective actions.

## Stop conditions
Escalate when privileged/destructive action is required, incident appears security-related, or evidence indicates a provider-wide failure outside team control.