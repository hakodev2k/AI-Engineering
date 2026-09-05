# Segregation of Duties Rules

## Purpose
Reduce compliance risk by preventing one actor from controlling incompatible high-risk steps without independent review.

## Scope
Applies to approvals, privileged changes, evidence validation, financial or regulated workflows, and production compliance decisions.

## MUST
- Incompatible duties MUST be identified for high-risk workflows.
- Critical approvals MUST be independent from the action being approved when required by policy or risk.
- Conflicting access combinations MUST be prevented or monitored with documented compensating controls.
- Emergency overrides MUST be time-bounded and retrospectively reviewed.

## MUST NOT
- MUST NOT allow self-approval for controls that explicitly require independent authorization.
- MUST NOT use organizational titles alone as proof that duties are separated in system permissions.

## SHOULD
- Automate toxic-combination detection for privileged or regulated workflows.

## Exceptions
Exceptions require business necessity, compensating monitoring, duration, owner, and explicit approval.

## Verification
Inspect role matrices, workflow configuration, access assignments, approval history, and conflict reports.