# Agent Incident Response

## Purpose
Contain, investigate, eradicate, and recover from security incidents involving AI agents, compromised tools, poisoned memory, credential exposure, or unauthorized autonomous actions.

## When to use
Use when monitoring or users report suspicious agent behavior, unexpected tool calls, data leakage, privilege misuse, prompt-injection success, or compromised integrations.

## Inputs
Incident description, audit logs, traces, identities, tool records, memory contents, model/prompt versions, deployment metadata, and affected assets.

## Preconditions
Preserve evidence before making destructive changes unless immediate containment of active harm takes priority.

## Context to inspect
Agent runs, prompts and retrieved sources where policy permits, tool gateway logs, authorization decisions, credentials, browser/network telemetry, memory writes, deployment changes, and downstream systems.

## Core knowledge
Agent incidents can involve both probabilistic behavior and deterministic control failures. Investigation should distinguish model misbehavior from authorization defects, compromised data, tool vulnerabilities, credential leakage, or orchestration bugs.

## Procedure
1. Establish incident severity, scope, and active impact.
2. Contain by disabling affected tools, identities, routes, or agent versions without unnecessarily disrupting unrelated systems.
3. Preserve logs, memory snapshots, policy decisions, model/prompt versions, and relevant external evidence.
4. Identify initiating principal and complete delegation/tool chain.
5. Determine the first violated trust boundary.
6. Check prompt injection, source poisoning, credential compromise, authorization bypass, cross-tenant access, and tool abuse hypotheses.
7. Revoke or rotate exposed credentials.
8. Remove poisoned memory or indexed content and verify deletion propagation.
9. Patch deterministic controls before relying on prompt changes.
10. Reproduce the incident in an isolated environment when feasible.
11. Add regression tests for the proven attack path.
12. Restore capabilities gradually with heightened monitoring.
13. Document root cause, contributing factors, residual risk, and prevention actions.

## Decision points
Contain first when harm is ongoing. Prefer disabling a narrow capability over shutting down the whole platform when scope is known. Treat prompt changes as supplementary unless the root cause is genuinely non-security behavioral quality.

## Common failure patterns
Deleting evidence, rotating only one leaked token, fixing model prompts but not authorization, missing poisoned persistent state, re-enabling all tools at once, and failing to test recurrence.

## Verification
Verify unauthorized paths are closed, compromised credentials are invalid, poisoned state is removed, regression tests fail on the old design and pass on the fix, and monitoring detects repeated attempts.

## Expected output
An incident timeline, root-cause analysis, containment and recovery evidence, rotated assets, regression tests, and prioritized prevention actions.

## Stop conditions
Escalate immediately for uncontrolled data loss, active privilege compromise, legal/reporting obligations, or evidence that the incident crosses organizational boundaries.