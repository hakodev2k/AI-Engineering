# Privacy Change Governance Rules

## Purpose
Ensure privacy-sensitive changes are reviewed, approved, and reversible before they create uncontrolled risk.

## Scope
Schema changes, new data sources, sharing, retention changes, tracking, identity linkage, AI processing, vendor changes, and production privacy controls.

## MUST
- Material privacy changes MUST identify affected data, purposes, systems, users, downstream processors, and controls before release.
- High-risk changes MUST have documented reviewer approval and rollback or containment plans.
- Privacy-impacting configuration changes MUST be versioned and auditable where practical.
- Production changes that weaken privacy controls MUST require explicit human approval.
- Emergency changes MUST be reviewed retrospectively and normalized promptly.

## MUST NOT
- MUST NOT disable deletion, masking, consent, access, or retention controls merely to unblock delivery.
- MUST NOT deploy material privacy changes without verification evidence.
- MUST NOT rewrite Git history or conceal prior privacy-impacting changes.

## SHOULD
- Prefer small, observable, reversible changes with measurable acceptance criteria.

## Exceptions
Require documented urgency, risk, compensating controls, owner, approval, and follow-up deadline.

## Verification
Review pull requests, configuration history, approvals, test results, deployment records, rollback plans, and post-change validation.