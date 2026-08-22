# Kubernetes Troubleshooting

## Purpose
Diagnose Kubernetes failures systematically from symptoms to the responsible layer using evidence rather than speculative changes.

## When to use
Pending pods, crashes, failed traffic, storage errors, node issues, or degraded services.

## Inputs
Incident symptoms, timestamps, manifests, events, logs, metrics, and recent changes.

## Context to inspect
Desired/current state, pod status, events, controller conditions, endpoints, nodes, networking, storage, and platform components.

## Core knowledge
Start at the symptom and narrow layers. Events explain many reconciliation/scheduling failures; application logs alone rarely explain infrastructure faults.

## Procedure
1. Define impact, scope, and start time.
2. Identify recent changes.
3. Compare desired and observed state.
4. Inspect events and controller conditions.
5. Classify failure: scheduling, startup, runtime, network, storage, node, or control plane.
6. Test the smallest discriminating hypothesis.
7. Mitigate safely before deep repair when impact is active.
8. Capture evidence and root cause.

## Decision points
Rollback recent reversible changes when evidence supports them; avoid restarts that destroy diagnostic state unless mitigation requires it.

## Common failure patterns
Random kubectl changes, deleting pods reflexively, ignoring events, debugging the wrong namespace/context, and confusing symptoms with causes.

## Verification
Reproduce or explain the failure, apply fix, confirm recovery, and verify recurrence prevention.

## Expected output
Evidence-backed diagnosis, mitigation, root cause, and follow-up actions.

## Stop conditions
Escalate destructive actions or control-plane/provider failures beyond available authority.