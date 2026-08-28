# Workflow: Measure, Diagnose, Optimize
## Trigger
Slow multi-turn local-agent execution or cache-related engine/model change.
## Goal
Reduce repeated prefill while preserving output correctness.
## Inputs
Controlled benchmark workload, server metrics, thresholds, output-equivalence signal.
## Baseline
Cold request, exact repeat, and at least three growing-prefix turns.
## Stages
1. Measure baseline.
2. Diagnose cache miss/reuse state and architecture-specific behavior.
3. Form one hypothesis.
4. Implement the smallest change.
5. Measure the identical workload again.
6. If not improved, re-evaluate; maximum 2 retries.
7. Run equivalence verification.
8. Independent Benchmark Verifier reviews results.
## Checkpoints
After baseline; after each implementation; before accepting any speedup.
## Metrics
Cache-read ratio, full-refill rate, TTFT p50/p95/slope, equivalence failures.
## Retry policy
Maximum two optimization retries.
## Stop conditions
Output mismatch, cache corruption, missing controlled baseline, or exhausted retries.
## Failure path
Restore safe recomputation and preserve benchmark evidence.
## Verification
Before/after comparison plus independent rerun.
## Definition of Done
Baseline captured, limitation identified, measurable improvement demonstrated, equivalence passes, regression tests pass, independent verifier approves.
