# Production Troubleshooting

## Purpose
Diagnose Kubernetes incidents systematically from user symptom to proven root cause while minimizing production risk.
## When to use
Pending pods, CrashLoopBackOff, OOMKilled, networking failures, degraded nodes, rollout failures, or unexplained latency.
## Inputs
Incident timeline, affected scope, events, logs, metrics, manifests, recent changes.
## Context to inspect
Workload status, events, node conditions, scheduler, networking, storage, DNS, controllers, quotas, and audit/change history.
## Core knowledge
Start from scope and evidence. Kubernetes symptoms often propagate across layers; events and status conditions provide high-value causal clues.
## Procedure
1. Establish impact and timeline. 2. Freeze risky changes if needed. 3. Compare healthy and unhealthy instances. 4. Inspect status/events before logs. 5. Trace dependencies layer by layer. 6. Form a falsifiable hypothesis. 7. Run the least invasive test. 8. Mitigate user impact. 9. Confirm root cause and recovery. 10. Capture follow-up prevention.
## Decision points
Mitigate before root-cause completion when SLO impact is severe; prefer rollback over novel repair when a recent change is strongly correlated.
## Common failure patterns
Random restarts, deleting evidence, tunnel vision on application logs, changing multiple variables, and declaring recovery without confirming user impact.
## Verification
Confirm SLO recovery, stable replicas/nodes, disappearance of causal errors, and reproducible explanation of the failure.
## Expected output
Timeline, evidence, root cause, mitigation, permanent fix, and prevention actions.
## Stop conditions
Escalate destructive actions, unknown data-integrity risk, security compromise, or access beyond authorization.