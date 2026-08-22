# Release Gate Rules

## Purpose
Use automation evidence responsibly when deciding whether a release is safe to proceed.

## Scope
Applies to required test gates, waivers, release candidates, rollback validation, and production smoke tests.

## MUST
- Required gates MUST define what risk they control and what constitutes failure.
- A failed critical gate MUST block release unless an authorized human explicitly accepts the documented risk.
- Gate waivers MUST record failure evidence, impact, compensating controls, approver, and expiry/follow-up.
- Post-deployment smoke tests MUST verify critical readiness without performing unsafe destructive actions.

## MUST NOT
- MUST NOT mark failed required tests as passed to unblock a release.
- MUST NOT interpret missing test execution as successful validation.
- MUST NOT let an AI agent independently approve high-risk production release or security-control bypass.

## SHOULD
- Keep blocking gates fast, stable, and directly tied to release-critical risk.
- Use progressive validation for high-impact deployments where supported.

## Exceptions
Emergency release paths require explicit human approval and documented compensating verification.

## Verification
Inspect gate configuration, execution completeness, waiver records, approvers, production smoke evidence, and post-release outcomes.