# AI Platform Incident Response

## Purpose
Provide a disciplined incident-response procedure for outages, quality regressions, provider failures, policy failures, runaway costs, and cross-tenant issues in shared AI infrastructure.

## When to use
Use for production incidents involving the model gateway, shared inference, provider access, prompt/config registry, evaluation service, AI policy controls, or platform-wide dependencies.

## Inputs
- Incident symptoms
- Alerts and SLO impact
- Logs, traces, and metrics
- Recent releases and configuration changes
- Provider status and quota data
- Tenant impact

## Context to inspect
Inspect request-path dependencies, model/provider versions, rollout history, policy changes, quotas, regional health, affected tenants, fallback behavior, and recent traffic shifts.

## Core knowledge
AI incidents may present as silent quality degradation rather than explicit HTTP failures. Triage must therefore evaluate infrastructure health, behavioral changes, cost anomalies, provider behavior, and policy enforcement together. Restore safe service before optimizing root-cause analysis.

## Procedure
1. Establish incident severity from user, security, financial, and SLO impact.
2. Identify affected tenants, workloads, models, providers, and regions.
3. Freeze unrelated production changes.
4. Compare incident onset with releases, alias changes, quota events, and provider behavior.
5. Choose the safest mitigation: rollback, disable a feature, reroute, shed load, or enter degraded mode.
6. Confirm mitigation using live telemetry and representative requests.
7. Preserve evidence needed for root-cause analysis.
8. Trace the failure across gateway, provider, retrieval, tool, and policy boundaries.
9. Identify the causal chain and contributing control failures.
10. Restore normal traffic gradually.
11. Create corrective actions with owners and deadlines.
12. Update runbooks, alerts, tests, or release gates based on lessons learned.

## Decision points
Prefer rollback when a recent reversible change correlates strongly with impact. Do not fail over to a semantically different model unless the fallback is approved and evaluated. For security or cross-tenant incidents, containment outranks availability.

## Common failure patterns
Debugging before containing impact, assuming provider success means model quality is healthy, changing multiple variables during triage, losing version metadata, excessive retries during outages, and postmortems without control improvements.

## Verification
Verify mitigation through SLO recovery, tenant-level telemetry, representative quality checks, cost normalization, and absence of continuing security or policy impact.

## Expected output
A contained incident, evidence-backed root cause, validated recovery, and prioritized corrective actions.

## Stop conditions
Escalate immediately for suspected data leakage, unauthorized access, safety-critical impact, provider compromise, or mitigation requiring destructive production changes.