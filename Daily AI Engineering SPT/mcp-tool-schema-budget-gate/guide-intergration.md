# Integration Guide

## 1. Export tool definitions
Capture the exact metadata your agent host would register. Normalize it to either a JSON array or `{ "tools": [...] }`. Add a stable `server` field to each tool so reports can attribute cost. Do not export credentials or runtime arguments.

## 2. Copy and tune policy
Start from `config/budget.json`. Set limits from a measured baseline rather than copying the sample thresholds blindly. Keep `tokenizer: "estimate"` for dependency-free CI, or install `tiktoken` and set `tokenizer` to an available encoding such as `tiktoken:cl100k_base` when appropriate. Exact provider token-count APIs remain preferable when available.

## 3. Measure
```bash
python scripts/tool_schema_budget.py tools.json --config config/budget.json --report report.json
```
Exit `0` means policy passed, `2` means a budget/capability-policy violation, and `3` means invalid input/config.

## 4. Establish baseline
Store the last known-good report in CI artifacts or a repository-approved metrics location. For an optimization change:
```bash
python scripts/tool_schema_budget.py tools.json --config config/budget.json --baseline baseline-report.json --report candidate-report.json
```
Do not compare unlike counting methods without recording that limitation.

## 5. Integrate with MCP exposure
Translate report decisions to your host/server mechanism: `hot` is initially model-visible, `deferred` is discoverable/on-demand where supported, and `disabled` is not exposed for that task/profile. If the host has no deferred-loading mechanism, use task-specific server/toolset profiles. The script is a policy and measurement gate; it does not modify an MCP client automatically.

## 6. Add CI gate
Run `python tests/test_budget.py`, then run the real inventory gate. Treat exit `2` as review-required. Raise a budget only with evidence explaining why added schema is necessary and how context impact is accepted.

## 7. Verify capability
Maintain representative domain tasks. Each critical workflow should assert the expected tool can still be found and safely invoked. Include a hot tool, a deferred tool, an ambiguous choice, and a negative task that should not expose a disabled tool.

## 8. Upgrade preflight
After client/provider/model upgrades, repeat initial-context measurement and discovery smoke tests. One clean-session retry is allowed for transient startup noise; a second failure blocks rollout until the cause is understood.

## Rollback
Keep the previous policy and report. If footprint improves but capability regresses, restore the last passing exposure policy. Never compensate by weakening authorization, approval, or schema validation.