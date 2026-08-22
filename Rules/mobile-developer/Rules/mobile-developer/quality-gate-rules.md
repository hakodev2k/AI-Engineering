# Quality Gate Rules
## Purpose
Require sufficient evidence before a mobile change is considered releasable.
## Scope
CI gates, release candidates, tests, static analysis, security, performance, store readiness, and known risks.
## MUST
- Release gates MUST cover critical tests, build/signing integrity, security/privacy checks, supported-platform smoke coverage, and known-blocker review.
- Waived failures MUST record reason, impact, evidence, owner, expiry, and authorized approval.
- New critical defects MUST block release unless explicit risk acceptance exists.
## MUST NOT
- Passing unit tests MUST NOT be treated as sufficient evidence for platform, signing, store, or production compatibility.
- Quality gates MUST NOT be silently disabled to meet a date.
## SHOULD
- Gates SHOULD be risk-weighted so high-signal checks remain fast enough to run consistently.
## Exceptions
Emergency releases may abbreviate noncritical checks with explicit approval and immediate follow-up.
## Verification
Inspect CI policy, release checklist, waiver records, test/device results, security scans, and release candidate provenance.