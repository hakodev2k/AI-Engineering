# Observability and Verification Rules

## Purpose
Ensure release impact is detectable quickly enough to make evidence-based continue, pause, or recovery decisions.

## Scope
Applies to production metrics, logs, traces, synthetic checks, business KPIs, alerts, and rollout checkpoints.

## MUST
- Material release risks MUST map to observable signals and expected healthy ranges before production execution.
- Pre-release baselines MUST be captured for signals used to judge release impact when comparison is meaningful.
- Rollout checkpoints MUST define observation duration and continue, pause, or rollback thresholds.
- Monitoring MUST cover both technical health and relevant customer/business outcomes for critical changes.
- Production conclusions MUST use available telemetry or equivalent operational evidence rather than confidence alone.

## MUST NOT
- Deployment-tool success MUST NOT be treated as proof of service health.
- Known telemetry gaps affecting critical failure detection MUST NOT be hidden from the go/no-go decision.
- Alerts MUST NOT be disabled to make a release appear healthy without explicit risk review and authorization.

## SHOULD
- Dashboards SHOULD isolate the affected service, region, cohort, version, or feature where possible.
- Release annotations SHOULD make change correlation visible in operational telemetry.

## Exceptions
When required signals are unavailable, document the gap, alternative evidence, reduced detection capability, compensating checks, risk acceptance, and approval.

## Verification
Inspect dashboards, alert state, baselines, release annotations, checkpoint thresholds, synthetic results, traces/logs where applicable, and recorded decisions against observed evidence.