# Workflow: Profile, Optimize, Verify Replay Amplification

## Trigger
Long-session token regression, excessive cache-read/input ratio, repeated unchanged reads, or compaction-related cost growth.

## Goal
Reduce redundant unchanged tool-result replay while preserving correctness and required evidence.

## Inputs
Representative workload, event trace, provider usage, compaction markers, current read tracker/compactor implementation, quality tests.

## Baseline
Run the workload unchanged and store trace + tokens/task + latency + quality result. Run `scripts/read_replay_guard.py` before proposing optimization.

## Stages
1. **Observe** — Context Profiler gathers artifact/hash/token events.
2. **Measure baseline** — Compute duplicate ratio and post-compaction duplicates.
3. **Diagnose** — Determine whether payload history, lost read state, or artifact handling causes replay.
4. **Hypothesize** — Select one durable content-addressed reuse change with an explicit expected metric impact.
5. **Implement** — Preserve the read ledger across compaction or replace repeated full payloads with safe references/bounded previews.
6. **Measure again** — Replay the same workload and collect the same metrics.
7. **Improved?** — If no, return to diagnosis with new evidence; maximum 2 hypotheses total.
8. **Verify** — Independent Verification Agent checks changed-content behavior and task quality.

## Responsible agent
Context Profiler for baseline/diagnosis; implementation owner for code changes; Verification Agent for final comparison.

## Tools
Trace queries, profiler script, test runner, token/latency telemetry, source diff, representative workload harness.

## Outputs
Baseline, root cause, implementation evidence, after metrics, quality comparison, final verdict.

## Checkpoints
- Baseline measured before change.
- Duplicate classification requires matching artifact + content hash.
- Changed artifacts still produce new evidence.
- Token savings are not accepted without quality checks.

## Metrics
Duplicate read token ratio, post-compaction duplicates, duplicate tokens, cache-read/input, tokens/task, latency/task, quality pass rate.

## Retry policy
Maximum two distinct optimization hypotheses. No retry without a changed hypothesis or new evidence.

## Stop conditions
Complete only when replay improves to the agreed budget and quality does not regress. Stop and retain original behavior after two failed hypotheses or when safe content identity cannot be established.

## Failure path
Restore required context behavior, preserve traces, document why reuse was unsafe/ineffective, and escalate to the context/runtime owner.

## Verification
Run unit tests plus the same representative task before and after. Verification must be independent of the implementation owner.

## Definition of Done
Evidence documented; baseline measured; root cause identified; durable continuity implemented; tests pass; before/after metrics collected; quality non-regressed; risks documented; independent verification complete; no blocking issue remains.
