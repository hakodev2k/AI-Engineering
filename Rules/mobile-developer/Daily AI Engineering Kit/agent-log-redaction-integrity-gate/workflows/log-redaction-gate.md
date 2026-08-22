# Log Redaction Integrity Gate Workflow

## Trigger
Logging, telemetry, exception handling, HTTP/message payload logging, redaction, formatter, or sink configuration is added or changed; or a leakage incident is investigated.

## Entry conditions
Target repository and logging path are identifiable; non-destructive local verification is allowed.

## Inputs
Changed files, logging configuration, redaction policy, representative synthetic fixtures, tests/build commands, sanitized logs if available.

## Stages
1. **Context** — Logging Investigator maps input → logging call → structured properties → formatter/enricher → sink output.
2. **Static scan** — run `python3 scripts/scan-logging-risks.py <repo> --output scan.json`; exit 1 requires review, not automatic failure.
3. **Classification** — classify candidate fields as secret, PII, operational, or correlation.
4. **Fixture design** — create synthetic secret and PII sentinel values plus allowed correlation identifiers.
5. **Plan** — define expected redaction behavior and smallest safe remediation.
6. **Approval checkpoint** — stop before production config, secret, sink, deployment, retention, or security-control changes.
7. **Execute** — implement only approved/in-scope changes.
8. **Test** — run focused application tests or equivalent local redaction path; verify sensitive sentinels are absent and correlation remains.
9. **Failure-path test** — exercise exception/error/raw-request paths with synthetic data.
10. **Review** — inspect diff for unrelated logging changes, weakened audit coverage, or accidental sensitive fixture values.
11. **Independent verification** — Verification Agent reruns relevant tests and challenges field classification/redaction boundary.
12. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Produced artifacts
`scan.json` when scanner is used, sanitized fixture outputs, and an assessment matching `schemas/assessment.schema.json`.

## Checkpoints
All changed log paths mapped; sensitive categories identified; raw payload/header paths reviewed; correlation requirement documented; synthetic fixture tests defined.

## Retry rules
Maximum two retries for transient tool/test-environment failures. Preserve sanitized command output, fixture identifier, and attempt number. Deterministic failures require diagnosis or change before rerun. After two transient failures, set `blocked` and escalate.

## Failure paths
Sensitive sentinel appears in output → `fail`. Correlation identifiers are lost → `fail` unless explicitly redesigned and approved. Permission/environment issue → `blocked`. Dangerous remediation → `needs-approval`. Unknown sink transformation that cannot be safely reproduced → document and block pass if it affects proof.

## Stop conditions
Only real production sensitive data could validate behavior; approval-required action lacks approval; two repeated transient failures; or independent verifier finds unresolved leakage/correlation loss.

## Definition of Done
Assessment validates; secret and PII fixtures were tested; correlation was preserved; raw payload/header paths were checked; independent verification completed; required approvals exist; remaining risks are recorded; and no blocking failure remains for `pass`.
