# Feature Flag Rollout Safety Rules

## MUST
- Capture a pre-change baseline before enabling a flag.
- Verify both flag-off and flag-on execution paths before rollout.
- Define measurable rollback thresholds before production enablement.
- Record the exact flag key, target environment, cohort, expected behavior, telemetry queries, and owner.
- Require explicit human approval for every production flag enablement and every rollout above 25%.
- Stop rollout when any declared error, latency, saturation, correctness, or business guardrail is breached.
- Preserve evidence from every rollout stage, including metrics snapshots and test results.
- Keep a deterministic rollback command or documented provider action ready before canary rollout.

## MUST NOT
- Do not enable a production flag when the flag-off path is untested.
- Do not increase rollout percentage while verification status is failed, unknown, or stale.
- Do not use a feature flag to bypass authentication, authorization, audit, or security controls.
- Do not delete old behavior during the rollout-verification phase.
- Do not change database schemas, production configuration, secrets, or contracts without separate explicit approval.
- Do not treat successful deployment as proof that the flagged behavior is correct.
- Do not retry the same failed rollout stage more than 2 times without new evidence.

## SHOULD
- Prefer stable targeting attributes such as account or user IDs over random per-request evaluation.
- Use small cohorts for medium/high-risk behavior.
- Include negative-path and fallback-path tests.
- Keep rollout stages short enough to detect regressions before exposure expands.
- Remove stale flags only in a separate cleanup task after rollout is verified.
