# Data Privacy Rules

## Purpose
Minimize privacy risk in targeting, evaluation, analytics, and experimentation.

## Scope
User attributes and event data processed by flag infrastructure.

## MUST
- Only attributes necessary for legitimate flag behavior MUST be collected or transmitted.
- Data classification and retention requirements MUST apply to flag telemetry and targeting data.
- Sensitive attributes MUST be protected in transit and at rest according to project requirements.
- Third-party flag services MUST be evaluated for data handling relevant to the integration.

## MUST NOT
- Raw secrets, authentication tokens, or unnecessary personal data MUST NOT be used as targeting keys.
- Debug logging MUST NOT bypass privacy controls.
- Retired targeting data MUST NOT be retained indefinitely without purpose.

## SHOULD
- Pseudonymous stable identifiers SHOULD be preferred when direct identity is unnecessary.

## Exceptions
Additional data use requires documented purpose, risk review, retention, and approval where required.

## Verification
Inspect schemas, SDK payloads, retention policies, vendor configuration, logs, and privacy reviews.