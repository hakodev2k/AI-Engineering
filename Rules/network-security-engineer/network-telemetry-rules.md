# Network Security Telemetry
## Purpose
Produce trustworthy evidence for detection, investigation, and control validation.
## Scope
Flow logs, firewall logs, DNS logs, IDS events, device audit logs, and packet-derived telemetry.
## MUST
- Critical enforcement points MUST emit telemetry sufficient to attribute security-relevant events.
- Time synchronization MUST support reliable event correlation.
- Telemetry retention and access MUST align with security, privacy, and operational requirements.
- Monitoring gaps MUST be detectable.
## MUST NOT
- Secrets, credentials, or unnecessary sensitive payloads MUST NOT be logged.
- Absence of logs MUST NOT be interpreted as absence of malicious activity.
## SHOULD
- Telemetry SHOULD include stable identifiers enabling cross-system correlation.
## Exceptions
Require documented data or technical constraint, compensating evidence, and approval.
## Verification
Inspect log sources, timestamps, retention, access controls, sample events, health alerts, and correlation tests.