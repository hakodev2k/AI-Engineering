# Release Safety Rules

## MUST
- Validate release evidence before decision analysis.
- Preserve source, timestamp, unit, baseline, and current value for every critical metric.
- Treat missing or stale critical evidence as `blocked` unless policy explicitly defines another safe behavior.
- Keep facts, hypotheses, decisions, and approvals distinct.
- Use the configured observation deadline; any extension beyond it requires human approval.
- Require explicit human approval before production rollback, traffic shift, production feature-flag mutation, database restore, production config change, or infrastructure mutation.
- Preserve evidence used for the decision and post-rollback verification.
- Re-run verification after any rollback executed outside this kit.

## MUST NOT
- Do not execute production rollback from this package.
- Do not infer that a release is healthy merely because alerts are absent.
- Do not override threshold breaches without recording the policy exception and human approver.
- Do not use a single uncorroborated sample as proof of recovery when policy requires sustained recovery.
- Do not silently extend observation to avoid a rollback decision.
- Do not increase tool permissions or use production credentials to unblock analysis.
- Do not let the Decision Analyst be the sole verifier of its own recommendation.
- Do not mark rollback verified if recovery criteria are incomplete or critical metrics are stale.

## SHOULD
- Prefer canary/gradual signals when available.
- Compare multiple independent signals for high-impact decisions.
- Include business and data-integrity signals, not only infrastructure metrics.
- Record competing explanations such as upstream outages or unrelated infrastructure events.
- Keep rollback execution adapters separate from analysis policy.