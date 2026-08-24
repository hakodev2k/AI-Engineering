# Observability and Crash Rules

## Purpose
Provide actionable production evidence without compromising user privacy or security.

## Scope
Applies to logs, crash reports, ANR diagnostics, metrics, traces, analytics used for engineering diagnosis, and correlation metadata.

## MUST
- Capture sufficient context to diagnose critical failures while redacting secrets and unnecessary personal data.
- Distinguish handled business failures from unexpected defects in telemetry.
- Monitor release health using crash/ANR and critical-journey indicators appropriate to the application.
- Correlate failures with app version, relevant device/API characteristics, and feature/config state where privacy permits.
- Validate telemetry behavior in release-like builds.

## MUST NOT
- Log credentials, tokens, sensitive form values, or raw personal payloads without an approved necessity and protection model.
- Swallow unexpected exceptions solely to improve crash-free metrics.
- Treat absence of telemetry as evidence of absence of failure.

## SHOULD
- Define alert thresholds around user impact rather than raw event volume.
- Preserve breadcrumbs that help reproduce state transitions without sensitive content.

## Exceptions
Additional diagnostic collection requires privacy/security review, bounded retention, and explicit purpose.

## Verification
Inspect release telemetry schemas, redaction tests, crash/ANR dashboards, synthetic failures, and privacy configuration.