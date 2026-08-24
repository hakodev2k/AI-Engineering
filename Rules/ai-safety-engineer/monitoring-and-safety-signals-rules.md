# Monitoring and Safety Signals Rules

## Purpose
Detect safety degradation, abuse, and control failures after deployment.

## Scope
Covers telemetry, dashboards, alerts, sampling, abuse signals, and safety KPIs.

## MUST
- Define measurable safety signals tied to known failure modes and mitigations.
- Establish alert thresholds, owners, response procedures, and escalation severity.
- Monitor control effectiveness as well as raw incident counts.
- Protect telemetry from unauthorized access and unnecessary sensitive-content retention.

## MUST NOT
- Collect sensitive content without a defined safety purpose and retention policy.
- Use vanity metrics that cannot trigger an operational decision as primary safety evidence.
- Leave critical alerts without an accountable responder.

## SHOULD
- Track leading indicators, near misses, and denominator-aware rates.
- Validate alerts through controlled exercises before relying on them.

## Exceptions
Reduced telemetry requires documented privacy/cost trade-off, alternative detection mechanism, and risk approval.

## Verification
Inspect dashboards, alert routing, sampled events, retention controls, runbooks, and evidence from alert tests or incidents.
