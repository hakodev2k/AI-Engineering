# Production Incident Debugging

## Purpose
Diagnose and mitigate LLM-serving incidents systematically while preserving evidence and minimizing user impact.

## When to use
Use for latency spikes, elevated errors, OOMs, hangs, incorrect routing, capacity loss, or rollout regressions.

## Inputs
Incident timeline, SLO dashboards, logs, traces, GPU/node metrics, recent changes, request samples, deployment state.

## Context to inspect
Gateway, queue, scheduler, workers, runtime, collectives, model artifacts, autoscaler, cluster, storage/network dependencies, and change history.

## Core knowledge
Separate symptom, blast radius, and causal mechanism. TTFT, TPOT, queue time, GPU memory, batch behavior, and collective stalls localize different failure classes. Mitigation precedes deep root-cause work when users are impacted.

## Procedure
1. Confirm incident and affected SLOs. 2. Establish start time and blast radius by model/region/tenant/version. 3. Check recent changes. 4. Compare queue, TTFT, TPOT, errors, memory, utilization, and node health. 5. Mitigate via rollback, traffic shift, capacity, or shedding when evidence supports it. 6. Preserve logs/traces/configuration. 7. Form ranked hypotheses. 8. Test one hypothesis at a time using safe evidence. 9. Verify recovery against SLOs. 10. Identify root cause and contributing factors. 11. Add regression detection and corrective actions.

## Decision points
Rollback early when a recent change strongly correlates and rollback is safe. Avoid restarts that destroy evidence unless needed to restore service.

## Common failure patterns
Changing many variables, relying on averages, restarting blindly, ignoring queueing, attributing all failures to GPUs, and declaring recovery before tail metrics normalize.

## Verification
Confirm sustained SLO recovery and reproduce or otherwise substantiate the causal mechanism.

## Expected output
Mitigated service, evidence-backed root cause, timeline, and preventive actions.

## Stop conditions
Escalate when production access is insufficient, mitigation risks data/security impact, or hardware/vendor diagnostics require specialized support.