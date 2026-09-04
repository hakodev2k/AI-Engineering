# Idle Resource Remediation

## Purpose
Find and safely eliminate idle, abandoned, or over-retained AI resources without disrupting active experimentation or production systems.

## When to use
Use when GPU nodes, notebooks, model endpoints, vector indexes, storage, or test environments accumulate persistent idle cost.

## Inputs
- Resource inventory
- Utilization telemetry
- Ownership metadata
- Deployment state
- Retention and deletion policies
- Billing data

## Context to inspect
Inspect last activity, scheduled jobs, endpoint traffic, notebook sessions, attached volumes, snapshots, experiment metadata, resource dependencies, and business criticality.

## Core knowledge
Idle-cost remediation must distinguish truly abandoned resources from warm capacity, disaster-recovery assets, scheduled workloads, and latency headroom. Deletion risk often exceeds the apparent monthly savings unless ownership and recovery are understood.

## Procedure
1. Define resource-specific idle criteria and observation windows.
2. Identify low/no-use resources and estimate monthly cost.
3. Resolve owners and business purpose.
4. Check dependencies, recovery requirements, and upcoming schedules.
5. Classify each candidate as retain, resize, suspend, archive, or delete.
6. Notify owners according to policy.
7. Apply reversible actions first where practical.
8. Back up or snapshot only when economically justified.
9. Remove resources after the grace period and approval rules.
10. Confirm billing stops and dependencies remain healthy.
11. Add lifecycle controls to prevent recurrence.

## Decision points
Suspend compute when future reuse is likely; delete when re-creation is cheap and ownership is absent; retain intentional warm capacity only when its reliability value is documented.

## Common failure patterns
Deleting resources based on a single low-utilization window, orphaning storage after compute deletion, retaining snapshots indefinitely, and claiming theoretical rather than billed savings.

## Verification
Confirm resource state, application health, owner acknowledgement when required, and realized billing reduction after the next billing interval.

## Expected output
A remediation register with candidates, actions, approvals, recovered cost, and prevention controls.

## Stop conditions
Stop when ownership is disputed, resource dependencies are unclear, retention policy forbids deletion, or the resource supports a critical recovery objective.