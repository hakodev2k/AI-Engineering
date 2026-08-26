# Alerting Rules

## Purpose
Detect harmful flag states and rollout regressions with actionable signals.

## Scope
Alerts associated with evaluation health, rollout guardrails, and configuration anomalies.

## MUST
- Alerts MUST identify an actionable condition, owner or responder path, and expected response.
- Critical rollouts MUST define abort signals before exposure increases.
- Alert thresholds MUST be based on service objectives or measured baselines where possible.
- Alert routing MUST be tested for critical controls.

## MUST NOT
- Alerts MUST NOT depend on a single noisy metric when corroboration is required for safe automation.
- Persistent false positives MUST NOT be accepted as normal.
- Rollout automation MUST NOT ignore breached hard safety thresholds.

## SHOULD
- Alerts SHOULD include flag identity, current exposure, recent changes, and runbook context.

## Exceptions
Temporary threshold changes require reason, duration, owner, and follow-up.

## Verification
Review alert definitions, test notifications, incident history, guardrail simulations, and ownership metadata.