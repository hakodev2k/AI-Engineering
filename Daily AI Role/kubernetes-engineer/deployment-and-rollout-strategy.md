# Deployment and Rollout Strategy

## Purpose
Release Kubernetes workloads with bounded risk, observable progress, and reliable rollback.
## When to use
New services, risky releases, rollout failures, or deployment-standard design.
## Inputs
SLOs, compatibility constraints, migration requirements, manifests, test evidence, rollback capability.
## Context to inspect
Deployment strategy, maxSurge/maxUnavailable, probes, PDBs, HPA, schema/API compatibility, feature flags, traffic controls.
## Core knowledge
Rolling updates require old/new versions to coexist safely. Database and API compatibility often determine whether rollback is actually possible.
## Procedure
1. Classify release risk. 2. Verify backward/forward compatibility. 3. Define readiness and rollout thresholds. 4. Choose rolling, canary, or blue/green. 5. Separate irreversible migrations. 6. Deploy to small scope. 7. Compare SLO/error signals. 8. Expand progressively. 9. Roll back on predefined thresholds. 10. Confirm post-release stability.
## Decision points
Use canary for measurable runtime risk; blue/green for strong environment isolation; ordinary rolling updates for low-risk compatible changes.
## Common failure patterns
Readiness passes before usable, irreversible migration before validation, no rollback trigger, rollout faster than telemetry, and HPA fighting rollout capacity.
## Verification
Prove healthy mixed-version operation, rollback, traffic continuity, and stable SLOs after full rollout.
## Expected output
Release strategy with gates, metrics, rollback criteria, and evidence.
## Stop conditions
Stop when rollback is impossible and risk approval is absent, or schema/API compatibility is unresolved.