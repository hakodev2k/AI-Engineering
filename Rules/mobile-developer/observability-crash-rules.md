# Observability and Crash Rules
## Purpose
Make production failures diagnosable without compromising user privacy.
## Scope
Crash reporting, logs, traces, metrics, breadcrumbs, release health, and diagnostics.
## MUST
- Production crashes and severe errors MUST be attributable to app version, platform, and relevant non-sensitive context.
- Diagnostic data MUST follow privacy classification and redaction rules.
- Release health MUST distinguish crashes, hangs/ANRs, and critical workflow failures where platforms support them.
## MUST NOT
- Secrets, tokens, full sensitive payloads, or unnecessary personal data MUST NOT be logged.
- Expected user/network conditions MUST NOT flood error telemetry as indistinguishable defects.
## SHOULD
- Critical workflows SHOULD emit bounded events sufficient to reconstruct failure stages.
## Exceptions
Highly sensitive workflows may intentionally reduce telemetry with alternative reproducibility evidence.
## Verification
Inspect telemetry schemas, redaction, symbolication, crash grouping, release dashboards, and sample production incidents.