# Log Redaction Assessment Skill

## Purpose
Prove that logs do not expose secrets or sensitive personal data while preserving the correlation fields needed for debugging and incident response.

## When to use
Use when adding or changing logging, exception middleware, HTTP tracing, message payload logging, audit logs, telemetry enrichers, or log sink configuration.

## Inputs
Changed logging paths, representative structured log payloads, redaction policy, tests, and relevant sink/formatter configuration.

## Preconditions
Repository is readable; representative non-production fixtures can be used. Production data access is not required.

## Allowed tools
Repository search/read, bundled scanners, non-destructive tests/build, locally generated fixtures, read-only sanitized logs.

## Constraints
Never copy real secrets into fixtures. Scanner findings are hypotheses. Do not remove correlation identifiers merely to make leakage tests pass.

## Procedure
1. Identify every changed log-producing path and the boundary where structured properties are created.
2. Map fields into secret, PII, operational, and correlation categories.
3. Run `python3 scripts/scan-logging-risks.py <repo> --output scan.json` and review each hit in context.
4. Inspect exception serialization, request/response logging, headers, cookies, connection/config objects, and message payloads.
5. Create synthetic fixtures containing sentinel secret/PII values plus allowed correlation fields.
6. Apply the production-equivalent redaction path where possible. Use `scripts/redact-json.py` only as a reference/tool for structured fixtures, not as proof that application middleware uses it.
7. Assert sentinel sensitive values are absent after redaction while correlation fields remain unchanged.
8. Confirm partial masking cannot expose high-value secret material; prefer full replacement for secrets.
9. Check nested objects, arrays, casing variants, and failure/exception paths.
10. Implement the smallest safe fix, keeping logging schema compatibility unless explicitly approved otherwise.
11. Re-run focused tests, build/static checks, inspect the diff, and record unresolved sink/provider risks.
12. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
Evidence-backed assessment with findings, risk, recommendation, four verification flags, and remaining risks.

## Verification
A `pass` requires synthetic secret and PII fixtures to be tested, correlation identifiers preserved, and raw payload/header logging paths checked.

## Failure handling
Retry transient test/tool failures at most twice. Deterministic failures require diagnosis or code/config change before rerun. Preserve sanitized evidence. Escalate permission/environment blockers.

## Stop conditions
Stop before approval-required production/logging sink/security changes, when only real sensitive production data could validate the path, or after two repeated transient failures.
