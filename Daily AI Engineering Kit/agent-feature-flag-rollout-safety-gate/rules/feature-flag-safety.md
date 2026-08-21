# Feature Flag Safety Rules

## MUST
- Identify the exact flag key, environment, owner, affected cohort, and expiry before rollout.
- Preserve a working off/default path until rollout verification is complete.
- Validate every rollout plan with `scripts/validate_rollout.py` before changing flag state.
- Revalidate after any material change to stages, targets, thresholds, rollback instructions, environment, or expiry.
- Require explicit human approval for production rollout and 100% exposure when configured by policy.
- Record the actual provider state after each authorized change and compare it with the plan.
- Observe each stage for at least its configured duration before progression.
- Roll back or hold when abort thresholds are breached; do not average away a blocking metric.
- Keep production mutation credentials separate from planning and verification agents.

## MUST NOT
- Enable a production flag because tests pass without staged runtime verification.
- Start at 100% when canary rollout is required.
- Modify policy or environment labels to bypass a validator finding.
- Increase feature-flag provider permissions automatically.
- Disable or remove the fallback path during an active rollout.
- Continue when telemetry is unavailable or the active cohort cannot be determined.
- Treat `approval_required` as authorization to execute.
- Reuse approval after the rollout plan materially changes.
- Delete a flag, remove fallback code, or perform irreversible cleanup without explicit human approval.

## SHOULD
- Prefer internal users or the smallest representative cohort before percentage rollout.
- Use metrics that isolate the flag cohort when technically possible.
- Include technical and business health signals when the feature can affect both.
- Keep stages few enough to operate reliably while still limiting blast radius.
- Expire temporary flags promptly and create a separate cleanup task after stable verification.
