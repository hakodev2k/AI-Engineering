# Workflow: Profile, Optimize, Verify Cache Prefix

## Trigger
Cache-hit decline, agent token-cost increase, new model/provider, new tool catalog, or context-builder change.

## Goal
Increase reusable prefix stability and reduce net repeated input cost while preserving task quality and required context.

## Inputs
Representative traces, usage telemetry, tool schemas, prompt/context segments, cache policy, benchmark tasks.

## Baseline
Capture input tokens/task, cached tokens, cache-write tokens when available, latency/TTFT, stable-prefix ratio, prefix mutations/step, tool-schema size, and task success.

## Context
Follow `rules/cache-stability-rules.md` and `skills/cache-prefix-profiler.md`.

## Stages
1. **Observe** — collect sanitized traces from representative multi-step tasks.
2. **Measure baseline** — fingerprint segments and calculate current cache/token metrics.
3. **Diagnose** — identify the first unstable prefix segment and dominant repeated bytes/tokens.
4. **Form hypothesis** — state one minimal change and predicted metric effect.
5. **Optimize** — apply deterministic ordering, stable serialization, suffix relocation, explicit cache boundary, or safe tool scoping.
6. **Measure again** — rerun the same task distribution.
7. **Improved?** — require policy-compliant token/cache improvement with no unacceptable quality regression.
8. **Independent verify** — `subagents/cache-benchmark-agent.md` reruns comparison.
9. **Complete or bounded re-evaluation** — if blocked, allow one additional hypothesis/optimization cycle.

## Responsible agent
Context/cache implementation owner for stages 1–7; independent Cache Benchmark Agent for stage 8.

## Tools
Usage telemetry, benchmark harness, deterministic serializers, `scripts/cache_prefix_analyzer.py`.

## Outputs
Baseline report, mutation attribution, hypothesis, change record, before/after metrics, verifier decision.

## Checkpoints
- Baseline exists before optimization.
- Stable/volatile segment classification is explicit.
- No required context/security control was removed.
- Equivalent tasks are used before/after.
- Provider cache-read/write telemetry is captured when exposed.
- Quality remains within policy.

## Metrics
Input tokens/task, cache-read ratio, cache-write ratio, stable-prefix ratio, mutations/step, tool-schema bytes/tokens, latency/TTFT, task success/regression.

## Retry policy
At most two optimization cycles total. Change one major hypothesis per cycle so causality remains observable.

## Stop conditions
Stop on quality/security regression, incomparable workloads, missing correctness baseline, or two unsuccessful optimization cycles.

## Failure path
Restore the last verified prompt/context assembly, preserve trace evidence, mark unsupported cache telemetry as unavailable, and escalate with the mutation report.

## Verification
Independent benchmark agent must reproduce improvement and quality acceptance. Configuration change alone is not verification.

## Definition of Done
Evidence documented; baseline measured; root mutation identified; improvement implemented; before/after traces comparable; token/cache metric improves within policy; quality does not regress beyond policy; independent verification passes; no required context removed; no blocking issue remains.