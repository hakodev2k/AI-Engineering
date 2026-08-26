# Production Incident Debugging

## Purpose
Diagnose and mitigate RTC incidents quickly while preserving evidence and avoiding uncontrolled changes.

## When to use
Use for widespread call failures, quality regressions, regional outages, relay/SFU failures, or release-related incidents.

## Inputs
Incident scope, deployment history, signaling logs, RTC stats, infrastructure metrics, traces, packet evidence, and current mitigations.

## Core knowledge
RTC incidents cross layers. Effective diagnosis establishes a timeline and separates signaling, connectivity, transport, media, client, and infrastructure hypotheses. Mitigation and root cause are distinct.

## Procedure
1. Establish severity, affected cohorts, start time, and user impact.
2. Freeze unrelated risky changes and identify recent deployments/config changes.
3. Build a shared timeline.
4. Segment setup failure from connected-but-poor-quality sessions.
5. Compare healthy and unhealthy cohorts by region, platform, version, network, and media path.
6. Test the highest-evidence hypothesis with read-only data first.
7. Apply the safest reversible mitigation when impact warrants it.
8. Confirm recovery using user-facing indicators.
9. Preserve evidence and determine root cause, contributing factors, and detection gaps.
10. Add regression protection and operational follow-ups.

## Decision points
Rollback when a recent change strongly correlates and rollback risk is lower than continued impact. Fail over when dependency health is causal and capacity is sufficient. Avoid simultaneous independent changes unless incident command explicitly accepts attribution loss.

## Common failure patterns
Chasing anecdotes; changing many variables; declaring recovery from server health alone; losing packet/log evidence; confusing trigger with root cause; no regression test.

## Verification
Confirm user-facing SLO recovery, affected cohorts normalize, mitigation remains stable, and root-cause fix has targeted regression evidence.

## Expected output
A defensible incident timeline, mitigation result, root-cause statement, and prevention actions.

## Stop conditions
Escalate immediately for security/privacy impact, destructive actions, insufficient authority, or unresolved high-severity user impact.