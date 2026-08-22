# Cache Prefix Stability Budget Guard

## Category
Token

## Problem
Tool-heavy agents repeatedly resend large stable prefixes while tiny dynamic mutations, unstable tool serialization, or poor cache economics can cause misses or unnecessary cache writes. The result is avoidable token cost and latency that is difficult to attribute from total-token telemetry alone.

## Evidence
See `evidence/research.md` for current public evidence from OpenAI guidance, a real tool-heavy agent issue, production observability guidance, and long-horizon caching research.

## Existing approach
Teams commonly rely on automatic provider caching, cache only a system prompt, cache the entire history, or manually remove tools. These approaches can work but do not guarantee stable-prefix reuse or positive economics.

## Existing limitations
Volatile fields can appear before cache boundaries; tool order/serialization can change; tool schemas may dominate prefix size; provider cache writes may have explicit cost; and compression/tool reduction can damage correctness if not benchmarked.

## Proposed improvement
Fingerprint ordered prompt/tool segments, measure the longest unchanged prefix between agent steps, capture provider cache read/write telemetry, enforce cache budgets, and optimize only stable/volatile placement, deterministic serialization, cache boundaries, and safely scoped tool exposure.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `config/cache-policy.json` — measurable cache/token/quality thresholds.
- `skills/cache-prefix-profiler.md` — reusable profiling procedure.
- `rules/cache-stability-rules.md` — enforceable token/cache rules.
- `subagents/cache-benchmark-agent.md` — independent before/after verifier.
- `workflows/profile-optimize-verify.md` — bounded measure/optimize workflow.
- `hooks/cache-regression-check.md` — rollout gate.
- `scripts/cache_prefix_analyzer.py` — deterministic trace profiler/regression checker.

## Installation
Python 3.9+; no third-party dependencies. Export sanitized agent traces in the documented JSON shape.

## Configuration
Adjust `config/cache-policy.json` using measured provider/model behavior and representative workload data. Provider price changes should be handled by telemetry/configuration rather than hard-coded assumptions in the script.

## Usage
Trace records contain ordered `segments` with `type` and `content`, plus `input_tokens`, optional `cached_tokens`, `cache_write_tokens`, `latency_ms`, and top-level `quality_score`.

Profile a candidate:

```bash
python scripts/cache_prefix_analyzer.py candidate-traces.json --policy config/cache-policy.json
```

Compare to a baseline:

```bash
python scripts/cache_prefix_analyzer.py candidate-traces.json --policy config/cache-policy.json --baseline baseline-traces.json
```

Exit codes: `0` allow, `2` invalid, `4` review required, `5` regression/block.

## Workflow
Use `workflows/profile-optimize-verify.md`: Observe → Measure baseline → Diagnose first prefix mutation → Form one hypothesis → Optimize → Measure again → Independent verify. Maximum two optimization cycles.

## Metrics
Input tokens/task, cache-read ratio, cache-write ratio, stable-prefix ratio, prefix mutations/step, tool-schema size, latency/TTFT, task success, and regression rate.

## Verification
`Implemented` means cache-layout/context changes are present. `Measured` means representative before/after telemetry exists. `Verified` requires `subagents/cache-benchmark-agent.md` to reproduce improvements while quality remains within policy.

## Safety
Never remove security instructions, authorization constraints, required evidence, or correctness-critical context just to improve cache metrics. Missing cache telemetry must remain explicitly unknown. Restore the last verified assembly on regression.

## Failure handling
Detection: regression hook or benchmark failure. Evidence: sanitized traces, segment fingerprints, metrics, and first mutation boundary. Retry: one additional optimization hypothesis, maximum two cycles total. Fallback: restore last verified context assembly. Escalation: token/performance owner. Stop: quality/security regression, incomparable workload, or unavailable correctness baseline.

## Definition of Done
- Current evidence documented.
- Representative baseline captured.
- First unstable prefix boundary identified.
- Improvement implemented without deleting required context.
- Before/after workload is equivalent.
- Token/cache metric meets policy or improvement is demonstrated with measured evidence.
- Quality does not regress beyond policy.
- Independent benchmark verification passes.
- No blocking issue remains.

## Customization
Add provider-specific trace adapters upstream. Keep the analyzer provider-neutral by converting telemetry into common fields. Extend segment types when necessary, but preserve actual serialization order so fingerprints reflect real cache behavior.