# PKI Change and Release Rules

## Purpose
Prevent trust outages and security regressions from PKI changes.

## Scope
CA configuration, profiles, policies, trust anchors, HSMs, status services, and automation.

## MUST
- Material changes MUST document affected trust paths, relying parties, security impact, test evidence, rollback, and owner.
- Production changes to trust anchors, CA keys, security controls, or destructive state MUST require human approval.
- Changes MUST be validated in representative environments before broad production rollout where feasible.
- Post-change verification MUST confirm issuance, validation, revocation, and monitoring behavior relevant to the change.

## MUST NOT
- MUST NOT force-push or rewrite audit-relevant history to conceal change provenance.
- MUST NOT weaken validation or access controls merely to unblock a release.
- MUST NOT execute irreversible PKI changes without approved recovery strategy.

## SHOULD
- High-risk changes SHOULD use staged rollout and explicit abort thresholds.

## Exceptions
Emergency changes require authorized execution and retrospective review.

## Verification
Review diffs, approvals, test results, rollout evidence, rollback readiness, and post-change probes.