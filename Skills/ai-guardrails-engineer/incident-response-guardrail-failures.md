# Incident Response for Guardrail Failures

## Purpose
Contain, investigate, remediate, and learn from guardrail incidents.

## When to use
Use for missed prohibited outcomes, overblocking, outage, or unsafe action.

## Inputs
Incident, traces, versions, deployment history, resources, logs, mitigations.

## Context to inspect
Inspect decision chain, recent changes, dependencies, tools, exposure, related incidents.

## Core knowledge
Containment precedes diagnosis; failures may be semantic, architectural, reliability, data, or policy defects.

## Procedure
1. Classify severity/scope.
2. Contain.
3. Preserve evidence.
4. Reproduce safely.
5. Identify causal layer.
6. Assess blast radius.
7. Apply narrow mitigation.
8. Add regressions.
9. Root-cause analysis.
10. Track corrective actions.

## Decision points
Disable risky capabilities under high uncertain impact; avoid prompt-only fixes for authorization defects.

## Common failure patterns
Continuing rollout, lost evidence, one-string fixes, no scope analysis, unverified restore.

## Verification
Reproduce before and prove after remediation.

## Expected output
Timeline, containment, root cause, tests, corrective actions.

## Stop conditions
Escalate active sensitive, privileged, cross-tenant, or notification-impact incidents.