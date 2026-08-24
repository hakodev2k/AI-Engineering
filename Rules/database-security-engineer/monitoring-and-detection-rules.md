# Database Security Monitoring and Detection Rules

## Purpose
Detect misuse, compromise, policy bypass, and material changes with actionable evidence.

## Scope
Covers authentication, privilege use, sensitive access, configuration, network exposure, data movement, and anomalous behavior.

## MUST
- Detection coverage MUST prioritize high-impact actions such as privilege escalation, audit disabling, unusual exports, and unauthorized configuration changes.
- Alerts MUST include sufficient context for triage without exposing unnecessary sensitive data.
- Detection rules MUST have an owner, severity rationale, response path, and test method.
- Collection health MUST be monitored so telemetry loss is distinguishable from normal inactivity.
- Material detections MUST link to an incident or investigation process.

## MUST NOT
- Alert volume MUST NOT be increased without considering operational capacity and false-positive cost.
- Security conclusions MUST NOT rely on a single telemetry source when corroborating evidence is available.
- Sensitive query payloads MUST NOT be captured indiscriminately.

## SHOULD
- Baseline normal administrative and workload behavior before defining anomaly thresholds.
- Tune detections using confirmed incidents and benign findings.

## Exceptions
Reduced monitoring requires documented blind spots, alternative evidence, duration, and risk approval.

## Verification
Generate controlled test events, trace them through collection and alerting, inspect routing and timestamps, review false-positive/false-negative evidence, and confirm runbooks are usable.