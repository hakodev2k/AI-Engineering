# Skill: Issue Triage

## Purpose
Convert a customer-reported technical problem into a prioritized, evidence-backed classification and actionable handoff.

## Trigger
Incident, error, degraded behavior, integration failure, suspected defect, or repeated support issue.

## Inputs
Expected/actual behavior, timestamps, environment, version, request IDs, logs, reproduction steps, scope, business impact, recent changes, and known workarounds.

## Procedure
1. Establish severity using user/business impact, production scope, security risk, workaround availability, and time sensitivity.
2. Capture expected vs actual behavior and first/last known occurrence.
3. Reproduce safely when possible; never use destructive tests on production without approval.
4. Separate symptoms from hypotheses.
5. Gather minimal sufficient evidence: sanitized logs, trace/request IDs, configuration, version, dependency status, and recent changes.
6. Compare against documentation, known limitations, and prior incidents.
7. Classify: configuration, usage, external dependency, data issue, product defect candidate, security concern, or unknown.
8. Recommend workaround only when its risks are understood.
9. Produce escalation packet when another team owns the next action.
10. Verify resolution with the original reproduction path and customer outcome.

## Outputs
Severity, classification, evidence set, hypothesis list, workaround, escalation packet, owner, and next checkpoint.

## Quality
Another qualified engineer must be able to continue without re-discovering basic context.

## Retry policy
At most two equivalent diagnostic retries. New evidence may justify a different attempt; otherwise escalate.