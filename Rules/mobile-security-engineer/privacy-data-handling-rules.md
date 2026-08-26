# Privacy and Data Handling Rules

## Purpose
Ensure mobile data collection and processing is minimized, controlled, and consistent with declared purposes.

## Scope
Personal data, identifiers, telemetry, sensors, contacts, location, advertising identifiers, and derived data.

## MUST
- Identify purpose, sensitivity, retention, sharing, and lawful/approved handling requirements before collecting sensitive data.
- Minimize collection and transmission to data necessary for the stated feature or operational purpose.
- Apply consent and platform privacy controls where required.
- Ensure deletion and account lifecycle behavior covers local copies and downstream systems within the role's control.

## MUST NOT
- Collect sensitive device data merely because an API makes it available.
- Repurpose collected data silently for materially different uses.
- Include sensitive values in analytics dimensions or event names without explicit review.

## SHOULD
- Prefer aggregation, coarse granularity, pseudonymization, and on-device processing when they satisfy the requirement.

## Exceptions
Exceptions require purpose, data classification, retention, recipients, risk, legal/privacy review where applicable, and approval.

## Verification
Trace representative data from collection through storage, telemetry, network transmission, sharing, retention, and deletion.