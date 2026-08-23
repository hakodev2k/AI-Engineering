# Alert and Detection Rules

## Purpose
Improve detection quality so responders are alerted for actionable symptoms with sufficient context.

## Scope
Monitoring alerts, anomaly detection, synthetic checks, paging, and incident triggers.

## MUST
- Tie paging alerts to meaningful customer, service, security, or data risk and provide actionable context.
- Define ownership, severity intent, threshold rationale, and runbook or investigation entry point for critical alerts.
- Review missed detections and noisy alerts after relevant incidents.
- Test that critical alert routes reach an accountable responder.

## MUST NOT
- Page solely on a low-level metric without a demonstrated relationship to actionable risk unless it protects a known hard limit.
- Silence persistent alerts without understanding and recording the underlying condition.

## SHOULD
- Prefer symptom-based service-level alerts complemented by diagnostic signals.

## Exceptions
Temporary broad alerts may be used during emerging risks if they have an owner and expiry or review point.

## Verification
Inspect alert definitions, routing tests, historical precision, missed incidents, response actions, and threshold evidence.