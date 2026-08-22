# Evidence and Observability Rules

## Purpose
Make test conclusions independently reviewable and diagnosable.
## Scope
Logs, screenshots, traces, videos, network captures, metrics, database evidence, and test reports.
## MUST
- Capture evidence proportional to risk and sufficient to support pass/fail conclusions for critical tests.
- Preserve timestamps, correlation identifiers, and environment context when diagnosing distributed failures.
- Redact sensitive data before sharing artifacts.
## MUST NOT
- Substitute screenshots for stronger machine-verifiable evidence when deterministic evidence is available.
- Store secrets or unrestricted personal data in test artifacts.
## SHOULD
- Use logs, metrics, and traces together when isolating cross-service failures.
## Exceptions
Restricted evidence must remain in approved secure locations with access noted.
## Verification
Audit reports for reproducibility, correlation, environment context, redaction, and evidence sufficiency.