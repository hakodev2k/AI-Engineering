# Storage Incident Response

## Purpose
Lead investigation and stabilization of production storage incidents while protecting data correctness, preserving evidence, and preventing recovery work from worsening the outage.

## When to use
Use for elevated error rates, unavailable partitions, replication loss, severe latency, capacity exhaustion, corruption signals, failed failovers, or unexpected data inconsistency.

## Inputs
Incident timeline, alerts, request metrics, replica health, topology, logs, traces, recent changes, capacity state, repair/compaction activity, and user impact.

## Preconditions
Establish incident command and identify operations that can destroy evidence or reduce redundancy before acting.

## Context to inspect
Affected shards and failure domains, leaders, replica state, network health, disk health, metadata service, deployments, configuration changes, repair backlog, backup status, and client retry behavior.

## Core knowledge
Storage incidents are dangerous because aggressive remediation can convert partial degradation into data loss. Stabilization usually means reducing load, stopping unsafe automation, restoring redundancy, or isolating bad components before optimizing performance. Separate control-plane symptoms from data-plane symptoms.

## Procedure
1. Define impact, scope, and start time.
2. Freeze nonessential changes and identify recent changes.
3. Check data-safety indicators before performance tuning.
4. Map affected partitions, nodes, zones, and dependencies.
5. Determine whether failure is capacity, network, coordination, storage-engine, or data-integrity related.
6. Reduce avoidable load and retry amplification when necessary.
7. Stop background work only when doing so improves safety or stability.
8. Restore minimum safe redundancy before decommissioning more components.
9. Apply the smallest reversible mitigation.
10. Continuously verify user impact and durability risk.
11. Preserve logs and state needed for root-cause analysis.
12. After stabilization, reconstruct the causal chain and create corrective actions.

## Decision points
Prefer reversible mitigations over destructive recovery. Fail over only when fencing and replica freshness are known. Pause repair or rebalancing if it is amplifying overload, but resume before redundancy debt becomes dangerous.

## Common failure patterns
Restarting many nodes simultaneously, deleting suspect data too early, promoting stale replicas, unbounded client retries, disabling safeguards without follow-up, and declaring resolution while under-replication remains high.

## Verification
Confirm request SLOs recover, replica health is restored, repair backlog is bounded, capacity headroom is safe, and no integrity or consistency alarms remain. Validate the mitigation against the original failure symptoms.

## Expected output
A stabilized service, incident timeline, evidence-backed root cause, residual risk assessment, and prioritized corrective actions.

## Stop conditions
Stop risky remediation when replica authority is unclear, corruption is suspected across multiple copies, or actions require destructive recovery without the appropriate approval.