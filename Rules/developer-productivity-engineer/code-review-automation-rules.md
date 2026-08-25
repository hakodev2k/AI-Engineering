# Code Review Automation Rules
## Purpose
Automate review checks without replacing accountable engineering judgment.
## Scope
Linters, policy bots, AI review, ownership checks, and merge annotations.
## MUST
- Automated findings MUST identify the violated policy or evidence behind the recommendation.
- Blocking checks MUST be deterministic enough to justify merge authority and provide remediation guidance.
- AI-generated review findings MUST be treated as hypotheses unless validated by code, tests, static analysis, or equivalent evidence.
- Changes to blocking policy MUST be reviewed for false-positive and bypass risk.
## MUST NOT
- MUST NOT auto-approve security-sensitive or high-risk changes solely from model confidence.
- MUST NOT expose private code or secrets to unapproved external processors.
## SHOULD
- Automation SHOULD suppress duplicate noise and prioritize actionable findings.
## Exceptions
Advisory experimental checks may have lower precision if clearly non-blocking.
## Verification
Measure precision, review sampled findings, test policy boundaries, inspect data handling, and validate bypass controls.