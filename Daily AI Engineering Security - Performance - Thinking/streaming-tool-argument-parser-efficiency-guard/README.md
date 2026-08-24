# Streaming Tool Argument Parser Efficiency Guard

## Topic
Efficient and correct parsing of streamed tool-call arguments.

## Category
Performance

## Problem
Repeatedly reparsing/repairing the complete accumulated JSON prefix on every streamed delta creates O(n²)-like work for large tool arguments and can contribute to event-loop stalls, hangs, truncation bugs, and wasted output.

## Evidence
`evidence/research.md` documents current 2026 reports from Prime Agent, DeepSeek Harness, Zed, GitHub Copilot CLI, and vLLM.

## Existing approach
Common adapters concatenate deltas and run partial-JSON parsing on each chunk, or buffer the entire argument until completion.

## Existing limitations
Per-chunk full-prefix work scales poorly; all-at-once buffering removes progress visibility; partial parsing can accidentally couple preview state to execution readiness.

## Proposed improvement
Use three separate lanes: O(total-bytes) raw delta accumulation, bounded/throttled preview materialization, and one authoritative final parse + schema validation before tool execution.

## Architecture
- evidence: `evidence/research.md`
- benchmark/profiler: `scripts/stream_arg_bench.py`
- regression tests: `tests/test_stream_arg_bench.py`
- enforceable rules: `rules/stream-parser-performance.md`
- optimization procedure: `skills/measure-optimize-stream-parser.md`
- independent verifier: `subagents/benchmark-verifier.md`
- bounded workflow: `workflows/benchmark-optimize-verify.md`
- deterministic merge gate: `hooks/pre-merge-scaling-gate.md`

## Actual package tree
```text
README.md
evidence/research.md
hooks/pre-merge-scaling-gate.md
rules/stream-parser-performance.md
scripts/stream_arg_bench.py
skills/measure-optimize-stream-parser.md
subagents/benchmark-verifier.md
tests/test_stream_arg_bench.py
workflows/benchmark-optimize-verify.md
```

## Installation
Python 3.9+ only for the reference benchmark; no third-party dependencies.

## Configuration
Choose payload sizes and chunk sizes representative of the provider. Keep at least four increasing payload sizes large enough to expose scaling. `--max-final-scaling` controls the reference-path scaling gate.

## Usage
Baseline reference behavior:
`python3 scripts/stream_arg_bench.py --sizes 4096,16384,65536,262144 --chunk-size 128 --repeats 3`

Regression tests:
`python3 tests/test_stream_arg_bench.py`

For a production adapter, instrument the implementation with the same generated/captured payload matrix before and after changing the parser.

## Workflow
Follow `workflows/benchmark-optimize-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Optimize → Measure again → Independent verify. Maximum optimization cycles: 2.

## Metrics
Parse CPU/wall ms, bytes, chunks, ms/KB, scaling ratio, event-loop delay where available, peak memory where available, final argument equality, malformed/truncated rejection.

## Verification
**Implemented** means the production parser separates accumulation/preview/final execution validation or uses an equivalent incremental design. **Measured** means identical before/after benchmark matrices exist. **Verified** requires measurable benefit, final semantic equality, malformed final JSON rejection, regression tests PASS, and independent Benchmark Verifier PASS.

## Safety
Never execute a partial argument merely because a prefix parses. Performance optimization must not drop fields, suppress errors, weaken schema validation, or change security-sensitive tool semantics.

## Failure handling
On regression, preserve benchmark evidence and revert or revise the strategy. Retry optimization at most twice, each with a changed evidence-backed hypothesis. Escalate if correctness and performance cannot both be satisfied.

## Definition of Done
Evidence current; baseline captured; root cause identified; improvement implemented; post-change metrics collected; improvement measurable; final arguments equal reference semantics; malformed/truncated input rejected; tests pass; verifier PASS; risks documented; no blocking issue remains.

## Customization
Replace the reference parser with the runtime's actual provider adapter while retaining the same size/chunk matrix and semantic-equivalence oracle.
