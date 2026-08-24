# Privacy and Data Minimization
## Purpose
Reduce privacy exposure created by distributed sensing and local data collection.
## Scope
Telemetry, sensor data, identifiers, local inference inputs, and exports.
## MUST
- Collection MUST be limited to data necessary for defined purposes.
- Sensitive data MUST have explicit retention and deletion behavior.
- Exported telemetry MUST exclude or transform unnecessary personal or sensitive fields.
## MUST NOT
- MUST NOT collect additional sensitive data merely because local storage is available.
- MUST NOT retain sensitive raw data indefinitely without justified requirement.
## SHOULD
- Aggregation or on-device transformation SHOULD be used when it meets the purpose with less exposure.
## Exceptions
Expanded collection requires purpose, retention, access controls, risk review, and approval where applicable.
## Verification
Inspect schemas, data flows, retention jobs, deletion tests, access controls, and sampled telemetry payloads.