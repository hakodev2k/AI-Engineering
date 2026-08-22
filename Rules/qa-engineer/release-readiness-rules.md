# Release Readiness Rules
## Purpose
Provide evidence-based quality assessment without exceeding decision authority.
## Scope
Release gates, residual risk, sign-off evidence, rollback readiness, and go/no-go recommendations.
## MUST
- Report completed coverage, failures, known defects, untested risks, environment limitations, and confidence basis before release.
- Distinguish QA recommendation from authorized business or operational approval.
- Require explicit human approval for production deployment when policy requires it.
## MUST NOT
- Report release readiness when critical evidence is missing without clearly stating the gap.
- Conceal failing tests or known severe defects to meet a date.
## SHOULD
- Include rollback, monitoring, and post-release validation for high-risk changes.
## Exceptions
Emergency releases require documented risk acceptance and targeted verification appropriate to urgency.
## Verification
Review release evidence, defect status, risk acceptance, approvals, rollback plan, and post-release checks.