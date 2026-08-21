# Streaming Tool Argument Robustness Guard

## Topic
Streaming Tool Argument Robustness Guard

## Category
Performance

## Problem
Streaming tool/function-call arguments can become a performance and reliability bottleneck when clients repeatedly reparse growing JSON prefixes, confuse deltas with cumulative snapshots, or start tools before arguments are finalized. Recent public reports show superlinear parsing work, multi-minute silence, malformed arguments, and agent hangs.

## Evidence
See `evidence/research.md`. The package is grounded in current reports from Prime Agent, GitHub Copilot CLI, Zed, vLLM, and LangGraphJS.

## Existing approach
Common implementations either parse every partial prefix, buffer everything until completion, use permissive repair parsing, or start selected tools with incomplete input.

## Existing limitations
Per-chunk full-prefix parsing scales poorly; end-only buffering harms visibility; partial parsing is not a safe execution boundary; and provider adapters differ on whether argument events are true deltas or cumulative snapshots.

## Proposed improvement
Normalize stream semantics first, aggregate with work proportional to new data, throttle any preview parsing, enforce byte/chunk/time budgets, require finalization before execution, and use the provider's final payload as authoritative. Benchmark before/after behavior and independently verify final argument equivalence.

## Architecture
- Evidence defines the observed problem and boundaries.
- Policy config supplies deterministic budgets.
- Investigation Skill provides an evidence-driven diagnosis procedure.
- Rules enforce finalization, bounded resource use, and measurable performance claims.
- Verification Agent independently checks correctness and metrics.
- Workflow defines the bounded measure/diagnose/optimize/verify loop.
- Pre-execution hook blocks incomplete or invalid streams.
- Script provides a reusable validator and benchmark.
- Tests cover delta, snapshot, final-authoritative, truncation, invalid-final, and benchmark behavior.

## Package tree
```text
README.md
config/policy.json
evidence/research.md
hooks/pre-execution-check.md
rules/streaming-argument-rules.md
scripts/stream_arg_guard.py
skills/stream-investigation.md
subagents/verification-agent.md
tests/test_stream_arg_guard.py
workflows/measure-optimize-verify.md
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Edit `config/policy.json` to match the target provider/runtime. Keep limits conservative until representative production traces justify larger values. `allow_incremental_execution_tools` is empty by default.

## Usage
Validate a captured JSONL stream:

```bash
python3 scripts/stream_arg_guard.py validate examples.jsonl --policy config/policy.json
```

Benchmark the repeated-full-prefix pattern against one-final-parse aggregation:

```bash
python3 scripts/stream_arg_guard.py benchmark --size 65536 --chunk 32 --repeats 3
```

Run tests:

```bash
python3 -m unittest tests/test_stream_arg_guard.py -v
```

## Event format
Each JSONL line contains `type` (`delta`, `snapshot`, or `final`) and string `data`. The final event is authoritative when policy enables it.

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → Compare → Independent verification.

## Metrics
Track median aggregation elapsed time, parse attempts, bytes reparsed/processed, peak buffered bytes, time-to-final-args, malformed/truncated streams, final mismatches, and execution-before-final violations.

## Verification
A change is not verified merely because the tool eventually runs. Verification requires final argument equivalence, budget enforcement, malformed/truncated failure tests, repeatable before/after metrics, and independent review.

## Safety
Partial preview JSON is never authorization to execute a side-effecting tool. Payload logs should use hashes/sizes/redacted structure rather than secrets or private content. Increasing limits is not an acceptable substitute for fixing an algorithmic or protocol problem.

## Failure handling
Detection is deterministic through validator exit codes. Benchmark noise may be retried at most 3 times. Truncated/invalid streams are not retried without new input. The fallback is to block tool execution and preserve sanitized trace evidence. Escalate unknown provider semantics to the adapter/provider owner. Stop after policy violation or three inconclusive measurement repeats.

## Status model
- **Implemented**: normalization/execution gate integrated and deterministic tests pass.
- **Measured**: identical baseline/candidate fixtures have recorded metrics.
- **Verified**: an independent verifier confirms final correctness, budget behavior, and the claimed improvement.

## Definition of Done
Current evidence documented; baseline captured; provider semantics classified; root cause supported; improvement implemented; tests pass; before/after metrics recorded; final arguments unchanged; no partial side-effect execution; policy budgets preserved; independent verification passes; no blocking regression remains.

## Customization
Adapters may map native provider events into the three event types. If a tool truly supports safe incremental execution, add it only after schema-specific tests prove that partial arguments cannot cause unintended side effects.
