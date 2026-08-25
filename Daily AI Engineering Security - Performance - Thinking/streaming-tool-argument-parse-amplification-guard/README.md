# Streaming Tool-Argument Parse Amplification Guard

**Category:** Performance

## Problem
Fine-grained LLM tool streaming can become slower as arguments grow when the runtime appends each JSON delta and repeatedly re-parses the full accumulated prefix. Current 2026 reports across multiple agent stacks show O(n²)-like CPU/allocation growth and event-loop stalls.

## Evidence
See `evidence/research.md`. It documents current PrimeIntellect, OpenClaw, DeepSeek Harness, and Anthropic evidence.

## Existing approach
Full-prefix partial JSON parsing is easy to implement and gives continuously reconstructed partial values. Alternatives include parse-at-completion, caps, cooperative yielding, and incremental parsers.

## Existing limitations
Full-prefix reparsing scales poorly; parse-at-completion sacrifices partial visibility; yielding does not reduce total CPU; caps bound damage but do not fix complexity; incremental replacements need semantic verification.

## Proposed improvement
Measure before changing the parser. Instrument streamed deltas, profile cumulative parse work, estimate scaling, implement a targeted optimization, repeat the exact benchmark, then gate on explicit budgets and correctness.

## Architecture
- `scripts/stream_parse_profiler.py` — JSONL trace analyzer.
- `scripts/regression_gate.py` — before/after budget gate.
- `config/budgets.json` — default measurable thresholds.
- `rules/performance-invariants.md` — measurement/correctness requirements.
- `skills/stream-parse-profiler.md` — investigation procedure.
- `subagents/performance-verifier.md` — independent verifier.
- `workflows/measure-optimize-verify.md` — bounded optimization loop.
- `hooks/regression-benchmark.md` — CI/pre-merge contract.
- `tests/test_stream_parse_profiler.py` — profiler regression tests.
- `evidence/research.md` — public evidence and root-cause analysis.

## Actual package tree
```text
README.md
config/budgets.json
evidence/research.md
hooks/regression-benchmark.md
rules/performance-invariants.md
scripts/regression_gate.py
scripts/stream_parse_profiler.py
skills/stream-parse-profiler.md
subagents/performance-verifier.md
tests/test_stream_parse_profiler.py
workflows/measure-optimize-verify.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Tune `config/budgets.json` only from representative benchmark evidence. Do not raise budgets in the same change merely to pass a regression.

## Usage
Instrument the stream loop to emit JSONL rows:
```json
{"buffer_bytes":4096,"delta_bytes":20,"parse_us":812.4}
```
Profile:
```bash
python3 scripts/stream_parse_profiler.py small.jsonl medium.jsonl large.jsonl
```
Compare:
```bash
python3 scripts/regression_gate.py --before before-small.jsonl before-large.jsonl --after after-small.jsonl after-large.jsonl --budgets config/budgets.json
```

## Workflow
Use `workflows/measure-optimize-verify.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → Verify.

## Metrics
Total parse CPU, parse CPU/final KB, scan amplification, scaling exponent, p95 per-delta parse time, event-loop stalls, and tool-input-ready latency.

## Verification
Run:
```bash
python3 -m unittest tests/test_stream_parse_profiler.py
```
**Implemented** means a targeted parser/stream change exists. **Measured** means identical before/after traces exist. **Verified** means the regression gate and correctness suite pass under independent review.

## Safety and correctness
Never execute incomplete tool-call JSON. Preserve final valid argument semantics. Treat malformed/truncated-stream behavior as a correctness requirement, not an optional performance trade.

## Failure handling
At most three optimization attempts. Each failed attempt must revise the hypothesis. If budgets cannot be met without correctness loss, revert/disable the experimental path and escalate with traces.

## Definition of Done
Current evidence documented; baseline captured; root cause supported by traces; improvement implemented; same fixtures re-measured; budgets pass; final argument semantics verified; malformed-stream tests pass; independent review complete.

## Customization
Add provider-specific instrumentation adapters or tighter budgets. The profiler intentionally consumes generic JSONL so it can be used from TypeScript, Python, Rust, Go, or Java runtimes.
