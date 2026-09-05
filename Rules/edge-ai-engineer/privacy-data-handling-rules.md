# Privacy and Data Handling Rules

## Purpose
Protect user and device data processed locally by edge AI systems.

## Scope
Inputs, intermediate features, outputs, caches, telemetry, synchronization, and retained local data.

## MUST
- Data collection and retention MUST be limited to what the feature requires.
- Sensitive data MUST be protected in storage and transit according to project requirements.
- Telemetry MUST avoid raw sensitive payloads unless explicitly authorized and necessary.
- Local data deletion and lifecycle behavior MUST be defined and testable.

## MUST NOT
- MUST NOT upload local inputs or outputs merely because connectivity is available.
- MUST NOT retain sensitive inference data indefinitely by default.

## SHOULD
- Prefer on-device processing and derived telemetry when they satisfy the product requirement.

## Exceptions
Additional collection requires purpose, retention, risk assessment, and approval.

## Verification
Inspect data flows, persistence code, telemetry schemas, retention settings, and privacy tests.