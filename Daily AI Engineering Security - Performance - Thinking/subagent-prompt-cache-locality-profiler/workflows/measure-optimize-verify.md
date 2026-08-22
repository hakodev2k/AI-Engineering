# Workflow — Measure, Optimize, Verify Cache Locality

## Trigger
Fan-out expansion, cache-write cost alert, model/client/tool-manifest upgrade, or token regression in a multi-agent workflow.

## Goal
Lower avoidable cache-creation tokens caused by dispatch topology while preserving correctness, quality, and security context.

## Inputs
Representative workload, JSONL usage telemetry, dispatch topology, threshold policy, client/model versions, tool-manifest hashes, quality/eval results.

## Baseline
Capture at least one complete dispatch group before changes. Deduplicate by request ID. Record cache creation/read/uncached tokens, sibling amplification, latency, and quality.

## Context
Use `evidence/research.md`, `rules/cache-locality-budget.md`, current provider cache documentation, and actual runtime telemetry.

## Stages
1. **Observe** — map parent/child fan-out and stable/dynamic context components.
2. **Measure baseline** — run profiler; rank high-creation groups.
3. **Diagnose** — inspect prompt structure, tool-manifest variants, model/TTL/key changes, and copied parent context.
4. **Form hypothesis** — choose one measurable structural cause.
5. **Optimize** — stabilize shared prefix/tool manifest, retrieve shared content on demand, reuse appropriate child/session state, or bound/serialize fan-out.
6. **Measure again** — rerun the identical workload using `--baseline`.
7. **Improved?** — if thresholds fail, re-evaluate with a changed hypothesis; maximum 2 optimization attempts.
8. **Quality/security gate** — reject lower-token results that lose required context, reduce quality, or weaken tool/security boundaries.
9. **Independent verification** — Benchmark Verifier reproduces or audits the comparison.
10. **Complete** — record Implemented, Measured, Verified separately.

## Responsible agent
Performance/token investigator for stages 1–8; `subagents/benchmark-verifier.md` for stage 9.

## Tools
Profiler script, usage logs/APIs, deterministic hashes, eval/test harness, source inspection, provider docs.

## Outputs
Baseline report, hotspot diagnosis, tested hypothesis, candidate report, before/after comparison, residual limitations, independent verification.

## Checkpoints
- Complete usage fields available.
- Streaming duplicates removed.
- Workload/model/tool security constraints comparable.
- Quality oracle unchanged.
- No required context removed.

## Metrics
Cache creation/read tokens, uncached tokens, cache-write share, sibling write amplification, tokens/task, cost/task, latency/task, quality pass rate.

## Retry policy
Maximum 2 optimization attempts. Each retry must test a changed root-cause hypothesis.

## Stop conditions
Success: thresholds pass, quality/security do not regress, independent verification succeeds. Failure: two attempts exhausted, telemetry insufficient, provider behavior uncontrollable without harmful trade-off, or quality/security regression remains.

## Failure path
Restore the known-good configuration, cap fan-out or choose a less wasteful orchestration mode, preserve measurement evidence, and escalate provider/runtime defect separately when appropriate.

## Verification
Run `tests/test_cache_locality_profiler.py`; run profiler on real representative telemetry; independently recompute key aggregates for the worst dispatch group.

## Definition of Done
Evidence documented; baseline captured; root cause supported by telemetry; optimization implemented; before/after metrics recorded; quality preserved; threshold results explicit; independent verification complete; no blocking regression remains.
