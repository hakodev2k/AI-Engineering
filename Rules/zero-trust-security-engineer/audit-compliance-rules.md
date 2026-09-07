# Audit and Compliance Rules

## Purpose
Ensure Zero Trust controls are demonstrable, reviewable, and supported by reliable evidence rather than undocumented assumptions.

## Scope
Applies to access policy, identity lifecycle, privileged activity, exceptions, telemetry, control testing, and regulated environments.

## MUST
- Security control claims MUST be supported by inspectable configuration, tests, logs, or equivalent evidence.
- Audit evidence MUST preserve actor, action, resource, decision, time, and relevant approval context where required.
- Evidence retention MUST meet applicable legal, regulatory, contractual, and incident-response needs.
- Material control deficiencies MUST have owners, severity, remediation plan, and tracked disposition.

## MUST NOT
- MUST NOT fabricate or backfill evidence to imply controls existed when they did not.
- MUST NOT expose unnecessary secrets or sensitive personal data in audit artifacts.
- MUST NOT treat certification or prior audit success as proof that current controls remain effective.

## SHOULD
- Control evidence SHOULD be generated automatically where deterministic verification is possible.
- Periodic reviews SHOULD sample both successful and denied access paths.

## Exceptions
Evidence gaps require documented cause, affected controls, alternate assurance, owner, risk acceptance, and remediation date.

## Verification
Review audit trails, control mappings, retention settings, access to evidence stores, exception records, independent test results, and samples proving current configuration matches documented policy.