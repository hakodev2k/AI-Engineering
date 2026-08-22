# Hooks

## PreModelCall — Final Request Budget Check

**Trigger:** after request rendering, immediately before provider invocation.

**Action:** run `scripts/context_preflight.py check` against the exact serialized request with explicit model limit/reserves.

**Command:** `python scripts/context_preflight.py check --request request.json --model "$MODEL" --context-limit "$CONTEXT_LIMIT" --exact-count "$EXACT_COUNT" --policy config/policy.json`

**Expected result:** exit 0 and decision `ALLOW`.

**Failure behavior:** exit non-zero blocks provider invocation; `REDUCE` routes to reduction workflow; missing metadata fails closed.

## PostModelCall — Measurement Reconciliation

**Trigger:** provider response includes measured input usage.

**Action:** append estimate/measured comparison to telemetry using `scripts/token_budget_report.py`.

**Command:** `python scripts/token_budget_report.py append --log token-budget.jsonl --request request.json --model "$MODEL" --estimated "$ESTIMATED" --measured "$INPUT_TOKENS"`

**Expected result:** immutable JSONL measurement record.

**Failure behavior:** do not fail the completed user request solely for telemetry failure, but emit an operational warning; repeated telemetry failures block calibration claims.

## OnContextLengthError — Retry Guard

**Trigger:** provider returns context-window/context-length rejection.

**Action:** hash the rejected request, mark it budget-failed, and forbid identical immediate retry. Rebuild/reduce and rerun preflight.

**Expected result:** next attempted request has a different hash or an explicitly changed model-capacity decision.

**Failure behavior:** identical retry is blocked and escalated as a deterministic orchestration bug.

## OnModelRoute — Model Metadata Validation

**Trigger:** coordinator delegates to another model/subagent or changes model dynamically.

**Action:** resolve target-model context limit and counting adapter; invalidate any budget decision made for the previous model.

**Expected result:** fresh model-specific preflight.

**Failure behavior:** unknown model metadata fails closed.

## CI — Regression Corpus

**Trigger:** changes to prompt templates, model routing, tokenizer adapter, policy, compaction, retrieval assembly, or tool schemas.

**Action:** run `python -m unittest tests/test_context_preflight.py`.

**Expected result:** all fixtures pass, including token-dense and mixed-model cases.

**Failure behavior:** block merge/release until failure is explained and policy is intentionally updated with evidence.
