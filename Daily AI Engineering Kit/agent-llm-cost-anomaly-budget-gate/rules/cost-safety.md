# LLM Cost Safety Rules

## MUST
- Enforce configured soft and hard budgets using deterministic usage data.
- Preserve request/model/token/cost evidence for every blocking finding.
- Require explicit human approval before any hard-budget override, production billing-limit change, production model upgrade above the configured multiplier, or removal of cost controls.
- Use least-privilege read access for billing/usage data and write access only where explicitly approved.
- Re-run the gate after a corrective change and report `task executed` separately from `verified successfully`.
- Treat missing or malformed cost data as an error, not as zero spend.

## MUST NOT
- Do not disable the gate, delete usage evidence, or raise budgets merely to make a run pass.
- Do not expose API keys, billing credentials, raw secrets, or sensitive prompt content in reports.
- Do not change production model/provider, retry count, quotas, or billing configuration without approval when the change can materially increase spend.
- Do not present statistical anomaly as confirmed root cause without repository/log/config evidence.
- Do not retry failed tooling more than two times per stage.

## SHOULD
- Prefer reductions in unnecessary context, retries, duplicate calls, and cache misses before quality-reducing model downgrades.
- Attribute spend to feature and user when privacy policy permits.
- Keep policy changes version-controlled and reviewable.
- Preserve before/after measurements for every optimization.
