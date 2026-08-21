# Evidence and Artifact Rules

## Purpose
Ensure failures and quality claims are supported by useful, safe evidence.

## Scope
Applies to logs, screenshots, videos, traces, network captures, reports, dumps, and test metadata.

## MUST
- Failed critical tests MUST retain evidence sufficient to reconstruct the tested state and failure point where tooling permits.
- Artifacts MUST include correlation information such as test identity, build/version, timestamp, and environment.
- Sensitive values MUST be redacted from stored and published artifacts.
- Quality conclusions MUST distinguish observed evidence from inference.

## MUST NOT
- MUST NOT publish secrets, authentication tokens, personal data, or unnecessary sensitive payloads.
- MUST NOT claim root cause solely from a screenshot or single symptom without supporting evidence.
- MUST NOT overwrite artifacts from independent parallel executions.

## SHOULD
- Prefer structured logs and traces searchable by correlation identifiers.
- Retain artifacts according to failure severity and investigation needs.

## Exceptions
Artifact capture may be reduced for privacy or cost reasons only with documented compensating diagnostic evidence.

## Verification
Inspect failed-run artifacts, redaction tests, retention settings, correlation metadata, and diagnostic usefulness during incident review.