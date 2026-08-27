# Observability Rules

## Purpose
Provide production evidence for diagnosing Salesforce failures and behavior.

## Scope
Applies to application logging, correlation, async jobs, integrations, and operational dashboards.

## MUST
- Critical transactions MUST emit enough context to correlate user action, record identifiers, async work, and external calls.
- Logs MUST classify failures so expected business rejections can be distinguished from system defects.
- Sensitive data MUST be redacted or excluded from logs.
- Operational conclusions MUST be supported by logs, job state, platform events, metrics, or equivalent evidence.

## MUST NOT
- MUST NOT log passwords, tokens, private keys, or unnecessary sensitive personal data.
- MUST NOT rely on ad hoc debug logging as the only production diagnostic mechanism for critical processes.
- MUST NOT suppress recurring failures without root-cause ownership.

## SHOULD
- Correlation identifiers SHOULD cross Apex, async, and integration boundaries.
- Alerting SHOULD focus on actionable business or reliability failures.

## Exceptions
Exceptions require documented data-handling and diagnostic trade-offs.

## Verification
Inspect log schemas, redaction behavior, correlation across workflows, alert definitions, and incident evidence.