# AI Incident Response

## Purpose
Diagnose, contain, and learn from production failures involving model behavior, retrieval, tools, safety, latency, cost, or provider dependencies.

## When to use
Use for harmful outputs, sudden quality regressions, runaway cost, tool misuse, data exposure risk, provider outages, or severe latency/error spikes.

## Inputs
Incident symptoms, traces, model/prompt/index versions, recent changes, user impact, provider status, security context.

## Preconditions
Establish incident severity and protect users/data before optimizing root-cause accuracy.

## Context to inspect
Deployment history, prompt/model versions, retrieval traces, tool calls, token/cost metrics, provider errors, feature flags, audit logs, evaluation results.

## Core knowledge
AI incidents may originate in code, data, model drift, provider changes, retrieval freshness, prompt changes, tool permissions, or traffic distribution. Containment and evidence preservation come before speculative fixes.

## Procedure
1. Classify severity, blast radius, and safety/privacy impact.
2. Contain using feature flags, rollback, model fallback, traffic limits, or tool disablement.
3. Preserve relevant traces and artifact versions safely.
4. Build a timeline of changes and symptoms.
5. Localize the failing stage using evidence.
6. Reproduce representative failures outside production.
7. Implement the smallest safe corrective action.
8. Validate with targeted tests plus broader regression evaluations.
9. Restore traffic gradually while monitoring.
10. Add the incident to tests/evaluations and record preventive actions.

## Decision points
Rollback first when user harm is ongoing and a known-good version exists. Disable autonomous tools immediately when authorization or duplicate-write behavior is suspect.

## Common failure patterns
Prompt tweaking before containment, losing exact versions, blaming the model without tracing retrieval/tools, exposing sensitive payloads in incident channels, and closing without regression coverage.

## Verification
Confirm containment, reproduction, corrected evaluations, stable canary metrics, and completion of preventative controls.

## Expected output
A contained incident, evidence-backed root cause, verified fix, and durable regression protection.

## Stop conditions
Escalate immediately for suspected data breach, unsafe irreversible actions, legal impact, or missing authority to contain production.