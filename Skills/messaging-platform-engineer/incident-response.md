# Messaging Incident Response

## Purpose
Provide a disciplined procedure for diagnosing and mitigating messaging incidents while protecting durability, ordering, and downstream systems.

## When to use
Use for broker outages, rapidly growing lag, publish failures, unavailable partitions/queues, data loss suspicion, retry storms, or widespread consumer instability.

## Inputs
- Incident symptoms and timeline
- Broker/client telemetry
- Recent changes
- Topology and ownership
- SLO and business impact

## Context to inspect
Inspect cluster health, leaders/replicas, storage, network, controller state, connection counts, throttling, consumer lag, retry/DLQ rates, deploy history, and cloud/service incidents.

## Core knowledge
Senior response prioritizes containment and evidence preservation. Messaging incidents can amplify quickly through retries, autoscaling, and downstream overload; mitigation must not destroy unconsumed data or invalidate recovery paths.

## Procedure
1. Establish scope, severity, affected flows, and incident owner.
2. Freeze risky changes and capture current metrics/configuration.
3. Determine whether failure is producer, broker, consumer, network, or dependency related.
4. Protect the platform by throttling or pausing non-critical traffic when necessary.
5. Restore quorum, storage health, leadership, or client connectivity using the least destructive action.
6. Control retries and consumer concurrency to avoid cascades.
7. Validate new publishes and consumption before declaring recovery.
8. Measure backlog and estimated drain time.
9. Preserve evidence for root-cause analysis.
10. Record remediation and follow-up actions.

## Decision points
Pause consumers when downstream corruption risk exceeds lag cost. Shed disposable traffic before weakening durability for critical flows. Fail over only when recovery risk is lower than continued outage risk.

## Common failure patterns
- Restarting everything without diagnosis
- Deleting queues/topics to clear symptoms
- Increasing consumers during downstream saturation
- Ignoring producer-side loss during broker recovery
- Declaring recovery while backlog still grows

## Verification
Confirm broker health, successful end-to-end test messages, stable publish errors, shrinking lag, controlled retries, and no unexplained data gaps.

## Expected output
A mitigated incident with verified service restoration, evidence, impact assessment, and follow-up actions.

## Stop conditions
Stop and escalate before destructive recovery, suspected data corruption/loss, unsafe failover, or actions requiring privileges outside the incident responder's authority.