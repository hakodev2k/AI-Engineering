# Production Validation Rules
## Purpose
Validate releases safely using operational evidence without creating production risk.
## Scope
Smoke checks, telemetry, feature rollout, production data, and post-deployment verification.
## MUST
- Define safe post-release checks for critical behavior and expected telemetry before high-risk deployment.
- Use logs, metrics, traces, alerts, and user-impact signals to validate production conclusions where available.
- Stop and escalate when validation indicates material harm or data-integrity risk.
## MUST NOT
- Perform destructive, load-heavy, or privacy-invasive production tests without explicit authorization.
- Use production customer data casually for test setup.
## SHOULD
- Prefer synthetic probes, canaries, feature flags, and reversible rollout mechanisms.
## Exceptions
Direct production interaction requires documented purpose, safeguards, authorization, and cleanup.
## Verification
Review deployment checklist, telemetry, probe results, approvals, and incident/rollback records.