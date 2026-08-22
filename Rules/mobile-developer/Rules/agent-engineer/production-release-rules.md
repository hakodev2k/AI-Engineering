# Production Release Rules
## Purpose
Release agent behavior safely and reversibly.
## Scope
Deployment, prompt/model/tool changes, feature flags, rollback, and production configuration.
## MUST
- Evaluate material behavior changes before production and define rollback criteria.
- Require human approval for production deployment or high-risk configuration changes unless an approved delivery policy explicitly authorizes automation.
- Monitor success, safety, errors, latency, and cost after release.
## MUST NOT
- Deploy breaking tool contracts or materially weaker guardrails without explicit review.
- Remove the last known-good rollback path during rollout.
## SHOULD
- Use staged rollout, canaries, feature flags, and shadow evaluation where practical.
## Exceptions
Emergency changes require incident authority, documented risk, and retrospective review.
## Verification
Inspect release evidence, approvals, rollout metrics, rollback tests, and configuration diffs.