# Privacy Testing Rules

## Purpose
Verify that implemented systems enforce documented privacy requirements.

## Scope
Collection, access, consent, deletion, retention, export, masking, sharing, and privacy-sensitive failure paths.

## MUST
- Critical privacy controls MUST have repeatable verification before release.
- Tests MUST cover negative cases such as unauthorized access, consent withdrawal, deletion failure, and data leakage.
- Test data MUST avoid unnecessary use of real personal data.
- Privacy regressions in critical controls MUST block release until resolved or explicitly risk-accepted.
- Test evidence MUST be retained for high-risk processing changes.

## MUST NOT
- MUST NOT assume a passing security test proves privacy compliance.
- MUST NOT seed non-production systems with unrestricted production personal data for convenience.

## SHOULD
- Automate deterministic privacy checks in CI/CD where practical.

## Exceptions
Require documented gap, manual verification evidence, owner, expiry, and approval.

## Verification
Review test suites, CI results, synthetic-data strategy, manual test records, defects, and release gates.