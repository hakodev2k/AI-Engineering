# Source Integrity Rules

## Purpose
Ensure released software is built from authorized, reviewable, and tamper-evident source states.

## Scope
Source repositories, protected branches, tags, release refs, code review, and repository administration.

## MUST
- Release source MUST originate from protected branches or equivalent controlled refs.
- Security-sensitive changes MUST receive independent review before merge.
- Branch protection and repository administration changes MUST be auditable.
- Release tags or refs MUST be immutable or otherwise protected against silent reassignment.
- Source history used for release MUST retain sufficient evidence to identify authorship, review, and approval.

## MUST NOT
- MUST NOT release directly from an unreviewed local working tree.
- MUST NOT bypass required review or protection controls merely to accelerate release.
- MUST NOT rewrite protected release history without explicit human approval and incident-grade documentation.

## SHOULD
- Signed commits or tags SHOULD be used where they materially improve trust verification.
- CODEOWNERS or equivalent ownership controls SHOULD protect sensitive paths.

## Exceptions
Exceptions require documented emergency reason, approver, affected refs, compensating review, and post-event reconciliation.

## Verification
Inspect branch protections, review history, tag configuration, repository audit logs, ownership rules, and release-source mapping.