# Parallel Tool Call Deduplication Gate

**Category:** Performance / Security

## Problem
Tool-calling models can emit multiple equivalent parallel tool calls in one model turn. Framework executors commonly treat each call as independent, producing duplicated reads, writes, API requests, cost, latency, and noisy tool results. For side-effecting tools, duplicated execution can also create correctness and safety failures.

## Evidence
Current LangChain issue #38708 (July 7, 2026) requests built-in middleware to collapse identical parallel tool calls and reports repeated production reimplementations. LangChain issue #36985 documents duplicate tool-call representations under Responses API streaming. See `evidence/research.md`.

## Existing approach
Teams manually preprocess model output, canonicalize `(tool_name,args)`, and keep the first call, or rely on idempotency inside individual tools. Existing retry/call-limit/HITL middleware does not generally collapse duplicate calls before execution.

## Existing limitations
Raw JSON comparison misses reordered keys; call IDs differ even when logical operations are equal; blanket deduplication can break intentionally repeated non-idempotent operations; post-execution idempotency does not remove wasted latency or duplicated read traffic.

## Proposed improvement
A pre-execution gate computes a deterministic signature from normalized tool name + arguments, classifies the tool's duplicate policy, collapses safe duplicates, and blocks ambiguous side-effect duplicates unless an explicit per-call uniqueness field or human-approved override exists.

## Package tree
- `evidence/research.md` — current evidence and root cause
- `config/policy.json` — tool-level duplicate policy
- `skills/deduplicate-parallel-tool-calls.md` — reusable procedure
- `rules/tool-call-deduplication-rules.md` — enforceable rules
- `subagents/tool-call-verifier.md` — independent verification role
- `workflows/deduplicate-and-verify.md` — bounded workflow
- `hooks/pre-tool-execution.md` — integration hook
- `scripts/dedupe_tool_calls.py` — deterministic gate
- `tests/test_dedupe_tool_calls.py` — executable tests

## Installation
Python 3.10+ only; no third-party packages.

## Usage
```bash
python scripts/dedupe_tool_calls.py calls.json --policy config/policy.json --out filtered.json
python -m unittest tests/test_dedupe_tool_calls.py
```
Input is a JSON array of `{id,name,args}` objects. The script emits a report plus the calls that may execute.

## Workflow
Observe duplicate-call signal → capture baseline duplicate execution ratio → classify tool semantics → canonicalize → deduplicate before execution → execute retained calls → compare latency/call count → independently verify no required operation was removed.

## Metrics
- duplicate execution ratio
- tool calls per logical operation
- avoided tool calls
- side-effect duplicate count
- p50/p95 tool-stage latency
- false-collapse rate on test fixtures

## Safety
Unknown tools default to `review`, not automatic collapse. Destructive/high-impact tools MUST use explicit policy. The gate never grants a permission that the original caller lacks and never substitutes deduplication for server-side idempotency.

## Failure handling
Malformed input blocks execution. Unknown or ambiguous tool policy returns `review_required`. Retry is bounded to one policy correction plus one regenerated model turn; then escalate.

## Definition of Done
Implemented: gate, policy, hook, workflow, rules and tests exist. Measured: before/after duplicate call count and latency are captured on representative traces. Verified: tests pass, intentionally distinct calls remain distinct, duplicate safe calls collapse, side-effect ambiguity requires review, and no security boundary is weakened.
