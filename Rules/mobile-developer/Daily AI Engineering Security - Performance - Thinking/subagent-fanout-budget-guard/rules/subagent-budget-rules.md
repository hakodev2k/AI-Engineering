# Subagent Budget Rules

## MUST
- Establish a serial or single-agent baseline for recurring workloads before claiming parallel improvement.
- Evaluate concurrency, per-child predicted tokens, aggregate predicted tokens, and bounded retry exposure before fan-out.
- Give each child a distinct, non-overlapping deliverable.
- Count cold retries as additional executions.
- Preserve correctness-critical context even when shrinking child context.
- Record observed child usage when telemetry exists and compare it with prediction.
- Bound redesign/retry cycles.

## MUST NOT
- Spawn extra agents merely because concurrency capacity exists.
- Treat a fixed child-count cap as sufficient cost control.
- Retry a child indefinitely after quota/session/compaction failures.
- Delegate deterministic grep/search/counting work to a full-context agent when a deterministic tool is sufficient.
- Ignore subagent usage because it is absent from parent-level telemetry.
- Claim lower cost or latency without measurement.

## SHOULD
- Prefer scoped context and explicit input artifacts over full parent-history inheritance.
- Reuse completed child artifacts/checkpoints after recoverable failures.
- Serialize work when expected child work is small relative to inherited context.
- Warn before predicted amplification exceeds configured thresholds.
- Keep provider/model-specific pricing outside core policy so the guard remains reusable.