# Cost Investigation Skill

## Purpose
Investigate unexpected LLM spend without guessing. Separate traffic growth, token growth, model mix changes, retries, cache misses, and pricing/config changes.

## When to use
Use when the gate returns `warn`, `block`, or `needs-approval`, or when spend materially diverges from the recent baseline.

## Inputs
- Usage events in JSONL.
- `config/budget-policy.yaml`.
- Feature/model ownership metadata when available.
- Recent deployment/configuration changes.

## Preconditions
Usage data must include request IDs, model, token counts, and cost. Never infer missing cost as zero.

## Allowed tools
Read repository files, logs, usage exports, metrics, git history, and deterministic scripts in this package.

## Constraints
- Treat anomalies as hypotheses until tied to evidence.
- Do not disable budget enforcement to continue investigation.
- Do not change model/provider, production config, or billing limits without approval.

## Procedure
1. Run `python scripts/llm_cost_gate.py --events <file> --policy config/budget-policy.yaml --output artifacts/cost-gate.json`.
2. Confirm whether the dominant driver is request count, input tokens, output tokens, model unit cost, retries, or cache effectiveness.
3. Group evidence by model, feature, and user where fields are available.
4. Compare anomalous requests to nearby normal requests.
5. Check recent commits/config changes affecting prompts, context size, retry policy, model selection, tool loops, or caching.
6. Form one hypothesis per driver and identify supporting/contradicting evidence.
7. Recommend the smallest safe corrective action.
8. Re-run the gate against representative data after any approved change.
9. Hand findings to the Verification Agent.

## Expected output
For each finding provide: finding, evidence, confidence, affected feature/model, cost impact, recommended action, and verification status.

## Verification
A conclusion is verified only when usage evidence or a reproducible test explains the observed increase and the corrective change lowers cost without breaking acceptance criteria.

## Failure handling
If telemetry is incomplete, stop with `insufficient-evidence`; list missing fields and do not claim root cause.

## Stop conditions
Stop on missing critical evidence, permission failure, hard-budget override requirement, or two failed deterministic retries.
