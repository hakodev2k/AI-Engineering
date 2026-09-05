# Monitoring and Detection Readiness

## Purpose
Ensure AI systems expose enough telemetry and alerting to detect incidents before user harm or cost grows significantly.

## When to use
Use during readiness reviews, after incidents, before high-risk launches, or when mean-time-to-detect is excessive.

## Inputs
Architecture, SLOs, risk register, telemetry inventory, alerts, evaluation metrics, audit logs, provider metrics.

## Preconditions
Critical user journeys and risk scenarios are defined.

## Context to inspect
Application metrics, model quality/safety signals, token/cost metrics, tool audit trails, retrieval metrics, provider status, tenant segmentation, trace sampling.

## Core knowledge
Infrastructure health alone cannot detect AI correctness or safety failures. Detection must combine operational signals with semantic quality, policy, security, data, and agent-action indicators.

## Procedure
1. Map high-risk failure modes to observable signals.
2. Verify request correlation across model, retrieval, and tools.
3. Add model/version and prompt/version dimensions.
4. Track error, latency, token, cost, and provider metrics.
5. Add retrieval quality and authorization signals.
6. Audit external tool actions and denials.
7. Define safety/security anomaly indicators.
8. Set alerts based on impact, not raw noise.
9. Test alerts with synthetic or replay scenarios.
10. Document dashboards and responder runbooks.

## Decision points
Prefer a small set of actionable alerts over high-volume weak signals. Use segment-level alerts when global averages hide concentrated harm.

## Common failure patterns
No model-version dimension, no tool-action audit, sampled traces that miss rare harms, alerting only on HTTP errors, and unowned dashboards.

## Verification
Known incident scenarios trigger actionable alerts with sufficient evidence to triage quickly.

## Expected output
A detection coverage map, validated alerts, dashboards, and runbook links.

## Stop conditions
Escalate launch risk when critical failure modes have no observable or containable signal.