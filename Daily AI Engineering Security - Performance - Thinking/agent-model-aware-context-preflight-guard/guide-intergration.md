# Integration Guide

## 1. Place the guard at the real provider boundary

The critical integration point is **after all request assembly and before the network/model call**. Do not run the guard only when building conversation history; system instructions, tool schemas, retrieved context, images/attachments metadata, memory, and provider wrappers may add input later.

Recommended call chain:

`task -> plan -> retrieve/tools -> render final provider request -> resolve actual target model -> count -> budget decision -> provider call`

Every alternate path—subagent, summarizer, memory worker, retry worker, evaluator, background job—must converge on the same admission boundary.

## 2. Carry explicit model metadata

Maintain a versioned model registry equivalent to `examples/model-registry.example.json`. Resolve the target model at the last responsible moment because routers and subagent definitions may override the coordinator model.

Required metadata per call:

- target model identifier;
- effective context/input limit;
- reserved output tokens;
- optional reserved reasoning/tool overhead;
- counting adapter/tokenizer version;
- policy version.

Unknown model capacity is a configuration failure, not permission to fall back to the coordinator's limit.

## 3. Count the final rendered request

Preferred order:

1. provider-supported preflight count API, when available;
2. provider-compatible local tokenizer for the exact selected model/version;
3. measured/calibrated local adapter proven equivalent for the request format;
4. conservative estimate only under the fallback utilization ceiling.

Pass the exact count into:

`python scripts/context_preflight.py check --request <rendered-file> --model <id> --context-limit <tokens> --exact-count <tokens> --policy config/policy.json`

Exit codes:

- `0`: `ALLOW`;
- `2`: `REDUCE`;
- `3`: `RECOUNT_REQUIRED`;
- `4`: configuration/input failure.

The wrapper should treat non-zero as **no provider call**.

## 4. Integrate with mixed-model subagents

When spawning a subagent, pass only logical task/context data. At the subagent's provider boundary, resolve that subagent's own model and limit. Invalidate any upstream budget decision because tokenization, tool prompt overhead, and context capacity may differ.

## 5. Reduction strategy

When `REDUCE` is returned:

1. preserve protected content IDs;
2. deduplicate repeated/static context;
3. replace stale large tool output with durable references if recoverable;
4. reduce low-relevance retrieval;
5. create a structured checkpoint for old history only if necessary;
6. render the whole request again;
7. recount and rerun the guard.

Maximum two reduction rounds. If required context alone does not fit, split the task or use an explicitly approved routing decision. Never keep shrinking until the request happens to pass.

## 6. Retry handling

Intercept provider context-window errors. Record the rejected request SHA-256. An identical request hash may not be immediately retried. Valid next actions are:

- correct model metadata;
- reduce/re-render payload;
- change capacity through an explicit policy/human routing decision.

Transient network retries remain separate from deterministic budget errors.

## 7. Observability and calibration

For each request record:

- request hash;
- model and policy version;
- count source;
- estimated/exact input tokens;
- admissible input tokens;
- reserves and safety margin;
- headroom/utilization;
- reduction actions;
- provider-measured input tokens when returned.

Use `scripts/token_budget_report.py append` after measured usage becomes available. Run `summarize` by model/tokenizer version; any under-count record should trigger investigation before loosening fallback thresholds.

Do not log prompt text or secrets merely to collect token metrics; request hash and numeric measurements are sufficient for this package.

## 8. CI and regression corpus

Run:

`python -m unittest tests/test_context_preflight.py`

Extend fixtures with production-shaped, non-sensitive samples for:

- minified/nested JSON;
- source code and punctuation;
- Vietnamese/CJK/emoji/non-ASCII;
- large tool schemas;
- retrieved chunks;
- mixed-model coordinator/subagent cases;
- provider wrapper/template overhead.

A model/tokenizer/template update is incomplete until the corpus has been rerun.

## 9. Rollout

Start in observe-only mode only if the surrounding runtime already has a reliable hard context guard. Compare decisions with provider usage. Then enable enforcement first for background jobs and high-utilization calls, followed by all calls. If observe-only mode finds under-counts near the boundary, do not ship permissive fallback; require exact counting instead.

## 10. Safety boundaries

This package optimizes token/context reliability; it must not bypass security or approval controls. Context reduction cannot remove security instructions, authorization requirements, human approvals, or evidence needed to verify dangerous actions. A request that cannot preserve those controls within budget must stop.
