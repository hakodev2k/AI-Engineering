# Security Review and Approval Rules

## Purpose
Ensure Senior-level mobile security decisions are evidence-based, reviewable, and bounded by explicit authority.

## Scope
Architecture changes, exceptions, production releases, access changes, key operations, security-control changes, and risk acceptance.

## MUST
- Distinguish analysis, recommendation, preparation, and execution when proposing security-sensitive actions.
- Document assumptions, evidence, alternatives, residual risk, reversibility, and owner for material security decisions.
- Require accountable human approval before weakening security controls, rotating production secrets, making high-risk access changes, or executing other irreversible/high-impact production actions unless explicitly preauthorized.
- Revalidate exceptions when their context, threat, or expiry changes.

## MUST NOT
- Treat AI confidence, intuition, or absence of reported incidents as security evidence.
- Silently expand execution authority beyond the task's approved scope.
- Approve one's own high-risk exception when independent approval is required by project policy.

## SHOULD
- Prefer reversible mitigations while uncertainty remains.
- Escalate decisions when potential impact exceeds available evidence or authority.

## Exceptions
Emergency authority must be explicitly defined, bounded, auditable, and followed by retrospective review.

## Verification
Inspect decision records, risk acceptances, approvals, evidence, expiry dates, change logs, and post-change validation.