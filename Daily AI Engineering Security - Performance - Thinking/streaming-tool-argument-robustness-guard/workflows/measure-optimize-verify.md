# Workflow: Measure → Normalize → Optimize → Verify

## Trigger
A streamed tool-call path shows high CPU/latency, long silence, malformed arguments, or tool-loop hangs.

## Goal
Improve streamed-argument handling without changing final tool semantics or weakening execution safety.

## Inputs
Raw traces, provider contract, baseline implementation, schemas, `config/policy.json`, and representative fixtures.

## Baseline
Capture at least four payload sizes. Record total bytes, chunks, aggregation elapsed time, parse attempts, estimated bytes reparsed, peak buffer size, time-to-final-args, final parse status, and any early tool execution.

## Context
Use `skills/stream-investigation.md` and enforce `rules/streaming-argument-rules.md`.

## Stages
1. **Observe** — reproduce with raw event ordering preserved.
2. **Measure baseline** — run the benchmark 3 times per payload size and retain median values.
3. **Diagnose** — identify delta/snapshot confusion, repeated-prefix parsing, early execution, provider buffering, or malformed finalization.
4. **Form hypothesis** — write one falsifiable expected change, such as “parse attempts fall from O(chunks) full-prefix parses to one final parse plus throttled previews.”
5. **Implement** — normalize event semantics, bound the buffer, throttle previews, and keep final execution gated.
6. **Measure again** — run identical fixtures and environment.
7. **Compare** — require final semantic equivalence and evaluate performance threshold.
8. **Independent verification** — hand to `subagents/verification-agent.md`.
9. **Complete or block** — only complete when metrics and correctness both pass.

## Responsible agent
Implementation agent owns stages 1–7. Verification Agent owns stage 8 and cannot be the sole implementation author.

## Tools
`python3 scripts/stream_arg_guard.py`, test runner, profiler if available, source diff, and sanitized traces.

## Outputs
Baseline JSON, candidate JSON, comparison table, fixture results, residual risks, and verification status.

## Checkpoints
- CP1: provider event semantics classified.
- CP2: baseline captured before code changes.
- CP3: no execution authorization depends on partial preview parse.
- CP4: after metrics captured with identical fixtures.
- CP5: independent verification complete.

## Metrics
Median elapsed aggregation time, parse attempts, bytes processed/reparsed, peak buffer bytes, malformed/truncated count, final mismatch count, and early-execution violations.

## Retry policy
Benchmark noise may be retried up to 3 times. A malformed stream may only be retried if new provider events or a corrected fixture are available.

## Stop conditions
Stop immediately on policy budget breach, missing final semantics, a side-effecting tool starting before authorization, or three inconclusive benchmark repeats.

## Failure path
Preserve traces and baseline, revert the candidate integration change, classify the blocking failure, and escalate to the provider/runtime owner. Do not disable validation or increase budgets solely to obtain a pass.

## Verification
The independent verifier must reproduce final-argument equivalence and the claimed metric improvement.

## Definition of Done
Evidence documented; baseline measured; root cause supported; candidate implemented; all fixtures pass; before/after metrics recorded; no safety boundary weakened; independent verification passes; no blocking regression remains.
