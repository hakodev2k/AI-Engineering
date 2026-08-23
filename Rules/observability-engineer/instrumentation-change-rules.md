# Instrumentation Change Rules
## Purpose
Prevent telemetry changes from silently breaking alerts, dashboards, and investigations.
## Scope
Metric names, fields, schemas, semantic conventions, and instrumentation libraries.
## MUST
- Assess downstream consumers before removing or changing critical telemetry.
- Version or coordinate breaking schema changes.
- Test instrumentation behavior and overhead before broad rollout.
## MUST NOT
- Rename or redefine critical signals without migration of dependent alerts and dashboards.
- Introduce instrumentation that materially degrades application performance without evidence and approval.
## SHOULD
- Maintain compatibility periods for widely consumed signals.
## Exceptions
Urgent security removal may break telemetry with documented mitigation and communication.
## Verification
Run schema/contract tests, dependency search, performance measurement, and dashboard/alert validation.