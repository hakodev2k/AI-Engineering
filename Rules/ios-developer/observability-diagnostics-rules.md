# Observability and Diagnostics Rules

## Purpose
Make production failures diagnosable without compromising user privacy.

## Scope
Logging, metrics, crash reports, traces, signposts, analytics used for engineering diagnosis, and support diagnostics.

## MUST
- Production diagnostics MUST capture enough context to distinguish major failure categories and affected app versions.
- Logs and telemetry MUST exclude secrets and minimize personal/sensitive data.
- Crash and error signals MUST be symbolicated and attributable to released build versions.
- Critical async and network flows SHOULD carry correlation context where practical.
- Diagnostic collection MUST respect consent and platform/privacy requirements.

## MUST NOT
- MUST NOT log full credentials, tokens, sensitive payloads, or unnecessary user content.
- MUST NOT claim a production root cause solely from an unverified hypothesis.
- MUST NOT add high-volume telemetry without assessing cost, privacy, and performance impact.

## SHOULD
- Prefer structured event categories and stable error identifiers.
- Use signposts or equivalent instrumentation for important latency paths.
- Preserve evidence needed to compare regressions across releases.

## Exceptions
Additional sensitive diagnostics require explicit privacy/security approval, narrow scope, retention limits, and removal criteria.

## Verification
Inspect emitted logs/telemetry, crash symbolication, privacy configuration, sampling, dashboards, and incident evidence from representative failure scenarios.