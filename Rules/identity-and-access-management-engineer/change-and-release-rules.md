# Change and Release Rules

## Purpose
Control IAM changes whose failures can cause lockout, privilege escalation, or broad production impact.

## Scope
Authentication policy, authorization policy, federation, directory, provisioning, privileged access, and identity-platform configuration changes.

## MUST
- Material IAM changes MUST have peer review, impact analysis, test evidence, and rollback or recovery planning before production execution.
- Changes affecting privileged access, authentication, or broad populations MUST use staged rollout where feasible.
- Production changes MUST be attributable and linked to an approved change record or equivalent evidence.
- Configuration drift between intended and deployed IAM policy MUST be detectable.
- High-risk changes MUST define explicit success and rollback criteria.

## MUST NOT
- MUST NOT make unreviewed production IAM changes solely to bypass an incident or delivery blocker.
- MUST NOT remove security controls without approved risk acceptance.
- MUST NOT deploy broad policy changes without evaluating lockout and privilege-escalation failure modes.

## SHOULD
- IAM configuration SHOULD be version-controlled and tested as code where supported.
- Canary or report-only modes SHOULD precede wide enforcement for risky policy changes.

## Exceptions
Emergency changes require authorized incident ownership, minimum necessary scope, contemporaneous logging, and retrospective review.

## Verification
Inspect change history, approvals, diffs, test evidence, rollout records, drift reports, rollback exercises, and post-change validation.