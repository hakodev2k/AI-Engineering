# Tool Result Carry-Cost Budgeter

## Topic
Measure and reduce the cumulative token cost of tool results retained across later model turns.

## Category
Token

## Problem
Per-call token counts hide a compounding cost: an early tool result may be resent on every later model request until eviction/compaction. Its effective task cost therefore depends on both payload size and lifetime in context.

## Evidence
See `evidence/research.md`. Current evidence includes Anthropic's tool-context guidance, OpenClaw issue #6650 on persistent tool/session bloat, current carry-cost analysis from Capsera, and August 2026 production notes on agent prompt-cache misses caused by conversation shape.

## Existing approach
Teams commonly cap individual tool outputs, monitor context size, compact histories, use prompt caching, or manually summarize old results.

## Existing limitations
Those methods rarely attribute cumulative repeated cost to the specific result that caused it. A uniform size cap can optimize the wrong payload because a small early result may cost more over the full task than a large late result.

## Proposed improvement
Instrument result lifetime and compute position-weighted carry cost from traces. Optimize the highest contributors using field projection, slicing, artifact references, programmatic tool chaining or earlier relevance-based eviction; then compare the same representative tasks before and after.

## Architecture
```text
agent trace JSONL ---> scripts/carry_cost_profiler.py <--- config/budget.example.json
                         |
                         +--> ranked carry contributors
                         +--> task budget pass/fail
                         `--> before/after verification
```

## Package tree
```text
README.md
evidence/research.md
config/budget.example.json
scripts/carry_cost_profiler.py
tests/test_carry_cost_profiler.py
rules/context-carry-budget.md
skills/carry-cost-analysis.md
subagents/token-verifier.md
workflows/measure-offload-verify.md
hooks/context-carry-regression.md
```

## Installation
Python 3.9+ is sufficient for the profiler. Tests require pytest:

```bash
python3 -m pip install pytest
```

The profiler itself uses only the standard library.

## Trace format
One JSON object per line. Supported events:

```json
{"type":"tool_result","turn":1,"id":"search-1","tokens":1200,"tool":"search"}
{"type":"model_turn","turn":2}
{"type":"evict","turn":3,"id":"search-1"}
```

A tool result is charged once as direct tool-result tokens and once more for each later `model_turn` before its eviction/end-of-trace. This is an attribution model for context-carriage analysis; provider billing/cache metrics should be tracked separately.

## Configuration
Copy `config/budget.example.json` and set budgets from measured representative tasks, not arbitrary desired savings.

## Usage
```bash
python3 scripts/carry_cost_profiler.py trace.jsonl --config config/budget.json --report carry-report.json
```

Exit `0` means budgets pass, `2` means at least one budget fails, and `3` means invalid input/configuration.

## Workflow
Use `workflows/measure-offload-verify.md`: Measure baseline → Diagnose top contributors → Form one hypothesis → Optimize → Measure again → independent verification. Maximum optimization attempts: two.

## Metrics
- direct tool-result tokens/task;
- cumulative carry tokens/task;
- total attributed tokens;
- carry amplification ratio;
- highest contributor share;
- tokens/task and latency/task;
- task-quality regression rate.

## Verification
Run:

```bash
python3 -m pytest -q tests/test_carry_cost_profiler.py
python3 scripts/carry_cost_profiler.py <trace.jsonl> --config <budget.json>
```

Then run the host's representative task-quality/security suite. A lower token count with lost required context is a failed optimization.

## Safety
Never evict authorization state, safety constraints, user requirements, evidence needed for a decision, or data required to verify correctness merely to meet a token budget. Prompt-cache savings are useful but must be reported separately from context removal.

## Failure handling
Detection: profiler budget violation or quality regression. Evidence: before/after reports and task results. Retry: maximum two changed hypotheses. Fallback: revert the context-removal change and keep the correctness-preserving trace. Escalation: platform/FinOps owner; security owner for boundary regressions. Stop after two unsuccessful attempts.

## Definition of Done
- **Implemented:** stable result IDs, lifetime trace events and profiler integration exist.
- **Measured:** representative baseline and optimized traces are recorded.
- **Verified:** cumulative carry tokens or tokens/task decrease, quality is equal or better, no critical context is lost, tests pass, and `subagents/token-verifier.md` records `VERIFIED`.

## Customization
Map provider/framework traces into the three event types. Replace integer token estimates with tokenizer/provider counts when available. Add cache-hit accounting as a separate cost dimension rather than folding it into carry-token reduction.