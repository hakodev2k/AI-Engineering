# Branch and Release Protection Rules

## Purpose
Protect authoritative source and release decisions from unreviewed or accidental changes.

## Scope
Applies to protected branches, tags, release branches, release approvals, and repository administration.

## MUST
- Authoritative release branches or equivalent references MUST require review and required status checks.
- Release tags or version references MUST be protected from routine mutation where the platform supports it.
- Administrative bypass capability MUST be limited and auditable.
- Emergency bypasses MUST be documented and retrospectively reviewed.

## MUST NOT
- MUST NOT rewrite released source history or move release references without explicit approval and impact assessment.
- MUST NOT disable required checks merely to make a failing release proceed.

## SHOULD
- High-risk repositories SHOULD require multiple independent approvals for release-affecting changes.
- Release references SHOULD be immutable once distributed.

## Exceptions
Exceptions MUST record the reason, affected reference, risk, approver, evidence, and follow-up action.

## Verification
Inspect branch, tag, and repository protection settings; audit bypass events; and compare release references with published artifacts and review history.