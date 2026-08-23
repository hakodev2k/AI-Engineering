# Release Observability Rules
## Purpose
Detect and attribute regressions caused by production changes.
## Scope
Deployment markers, canaries, rollout dashboards, and post-release validation.
## MUST
- Attach version/deployment identity to relevant telemetry.
- Define release health signals and rollback triggers before high-risk rollout.
- Compare canary or post-release signals to an appropriate baseline.
## MUST NOT
- Declare release health from deployment success alone.
- Broaden rollout when critical telemetry is unavailable without explicit risk acceptance.
## SHOULD
- Automate release annotations and guardrail evaluation.
## Exceptions
Emergency remediation may use alternate evidence when normal telemetry is impaired and incident authority approves.
## Verification
Inspect deployment markers, dashboards, baseline comparisons, alerts, and rollout decisions.