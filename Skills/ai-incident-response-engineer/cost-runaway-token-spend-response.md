# Cost Runaway and Token Spend Response

## Purpose
Contain sudden AI cost escalation caused by loops, retries, traffic abuse, context growth, model routing, or pricing/configuration changes.

## When to use
Use for budget alerts, token spikes, runaway agents, retry storms, unexpected premium-model use, or abnormal provider invoices.

## Inputs
Token usage, request volume, model mix, retries, agent steps, cache hit rate, tenant usage, pricing, recent changes.

## Preconditions
Cost controls and service-critical workloads are identifiable.

## Context to inspect
Routing rules, quotas, max tokens, context assembly, retry policy, agent step limits, caching, batch jobs, provider billing dimensions.

## Core knowledge
AI cost incidents can rise much faster than ordinary infrastructure cost because one logical request may fan out into multiple large-context model calls.

## Procedure
1. Confirm spend anomaly against usage telemetry.
2. Identify model, tenant, route, workflow, and time window.
3. Check loops, retries, duplicated jobs, and context growth.
4. Cap or suspend noncritical high-cost flows.
5. Apply token, step, and request limits.
6. Route suitable traffic to lower-cost validated models.
7. Fix the triggering defect.
8. Re-enable gradually under budget alarms.
9. Quantify avoided and residual cost.

## Decision points
Protect safety- and revenue-critical workloads before broad throttling. Do not switch models when quality or compliance would be violated.

## Common failure patterns
Looking only at request count, ignoring context size, allowing retries to multiply spend, and replacing models without validation.

## Verification
Spend rate returns within threshold and the same workload cannot recreate uncontrolled growth.

## Expected output
Cost incident root cause, containment, savings estimate, and permanent guardrails.

## Stop conditions
Escalate when contractual billing disputes or broad customer throttling require business approval.