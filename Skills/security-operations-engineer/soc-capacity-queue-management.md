# SOC Capacity and Queue Management

## Purpose
Keep investigation queues risk-prioritized and sustainable during normal operations and alert surges.

## When to use
Use for backlog growth, staffing planning, major detection rollouts, incidents or telemetry spikes.

## Inputs
Queue depth, arrival rate, handling time, severity, analyst availability, skills, SLOs and automation capacity.

## Context to inspect
Identify queue ownership, shift coverage, handoffs, recurring noisy rules, dependencies and escalation paths.

## Core knowledge
A queue is a flow system. Backlog grows when effective arrival rate exceeds service capacity. Priority must reflect risk, not merely age.

## Procedure
1. Measure arrivals, completions and backlog by severity.
2. Identify bottleneck stages and rework.
3. Protect high-severity response capacity.
4. Batch or automate deterministic enrichment.
5. Tune or temporarily rate-limit proven noisy detections with documented risk acceptance.
6. Route cases by required skill and asset context.
7. Define surge thresholds and staffing/escalation actions.
8. Monitor oldest-case age and SLO breach risk.
9. Conduct post-surge analysis and eliminate root causes.

## Decision points
Defer low-risk work rather than dilute high-risk response. Disable a broken rule only with explicit coverage impact and restoration owner.

## Common failure patterns
FIFO-only triage; mass-closing backlog; overtime as permanent capacity strategy; ignoring rework; suppressing noise without engineering follow-up.

## Verification
Confirm high-risk cases meet objectives, backlog trend stabilizes and temporary controls have expiry/owners.

## Expected output
Risk-based queue policy, surge plan, capacity indicators and remediation backlog.

## Stop conditions
Escalate when sustained demand exceeds safe capacity or required specialist/on-call coverage is unavailable.