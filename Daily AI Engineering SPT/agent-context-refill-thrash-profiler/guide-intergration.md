# Integration Guide

## Integration point
Place token attribution at the orchestration boundary where messages/tool results are assembled for the model. Record metadata, not raw sensitive content, into a JSONL telemetry stream compatible with `scripts/context_refill_profiler.py`.

## Event schema
For each context contribution emit:

```json
{"turn":42,"event":"context","source":"project_instruction","tokens":12400,"fingerprint":"sha256:...","artifact_id":"rules:abc"}
```

For each compaction emit:

```json
{"turn":41,"event":"compact"}
```

Sources should use: `system`, `project_instruction`, `tool_result`, `file_read`, `memory`, `history_summary`, `other`.

`fingerprint` should be a stable digest for content that is safe to compare for equality. Do not place raw content or secrets in telemetry. `artifact_id` must identify recoverable required state without embedding the content itself.

## Installation
Requires Python 3.10+ and only the standard library.

```bash
python scripts/context_refill_profiler.py tests/pass.jsonl --policy config/policy.json
```

The pass fixture should exit `0`. The thrash fixture should exit `2`:

```bash
python scripts/context_refill_profiler.py tests/fail-thrash.jsonl --policy config/policy.json
```

## Host wiring
1. Count tokens using the same tokenizer/accounting used by the target model when available.
2. Emit one contribution record before each payload enters the model request.
3. Hash unchanged static payloads before request serialization.
4. Create durable artifact IDs for large tool/file results before compaction can remove them.
5. Emit a `compact` event when compaction commits.
6. After the configured post-compact observation window, run the profiler.
7. On exit `2`, pause automatic context optimization and route to the bounded workflow in `workflows/workflows.md`.

## Mitigation mapping
- High `project_instruction` duplication: digest/reference or relevance-based hierarchical load.
- High `tool_result`: bounded summary plus durable artifact retrieval.
- High `file_read`: chunk/retrieve on demand; retain path/revision/range reference.
- High `history_summary`: reduce residue only after preserving active constraints and references.
- Low attribution coverage: improve instrumentation before optimization.
- Repeated compactions: checkpoint and perform one bounded recovery continuation.

## Safety
Never omit security instructions, user constraints, approval boundaries or irreversible-operation requirements merely to pass budgets. If a required artifact cannot be safely rehydrated, keep it in context and treat the token budget violation as an unresolved architecture issue.

## CI example
Run both fixtures plus representative production-like traces. Treat profiler exit code `2` as a regression failure. Keep policy changes code-reviewed because thresholds can trade cost against correctness.

## Customization
Adjust `config/policy.json` to the actual model window and workload. Start with observed baselines rather than arbitrary aggressive targets. Add host-specific source labels only if they map back to the required top-level attribution categories.
