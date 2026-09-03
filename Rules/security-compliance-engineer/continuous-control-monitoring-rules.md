# Continuous Control Monitoring Rules

## Purpose
Detect control degradation between point-in-time assessments and reduce reliance on periodic manual audits.

## Scope
Applies to controls that can be observed through configuration, telemetry, identity data, deployment state, vulnerability data, or automated tests.

## MUST
- Material continuously testable controls MUST have defined monitoring logic, ownership, severity, and response expectations.
- Monitoring MUST distinguish control failure from data-collection failure.
- Detected noncompliance MUST create traceable remediation or risk-acceptance records.
- Monitoring rules MUST be reviewed when architecture or control requirements change.

## MUST NOT
- A passing dashboard MUST NOT be treated as proof of compliance if source coverage is incomplete or stale.
- Monitoring alerts MUST NOT be silently suppressed to improve compliance metrics.
- Unknown monitoring gaps MUST NOT be reported as compliant states.

## SHOULD
- Prefer near-real-time detection for high-impact preventive controls.
- Track coverage, freshness, false positives, and unresolved failures as assurance health metrics.

## Exceptions
Controls unsuitable for continuous monitoring require documented periodic test frequency and rationale.

## Verification
Inspect monitor definitions, source coverage, alert history, remediation records, data freshness, and test samples that deliberately trigger failures.