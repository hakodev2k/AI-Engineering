# Workflow: Measure, Deduplicate, Verify

## Trigger
Image/media-heavy sessions, child-agent fanout, repeated compaction, or unexplained token/storage/network growth.

## Goal
Reduce repeated payload amplification while retaining correctness-critical multimodal information.

## Inputs
Representative workload, rollout/events, lineage, token/traffic/storage metrics, artifact bytes/hashes, and policy.

## Baseline
Capture unique payload bytes, total payload bytes, replay ratio, bytes/child, tokens/task, network bytes, rollout growth, compactions, and acceptance-test result.

## Context
Use `skills/payload-amplification-analysis.md`, `rules/payload-budget-rules.md`, and `scripts/payload_replay_guard.py`.

## Stages
1. **Observe** — collect immutable evidence and identify heavyweight artifacts.
2. **Measure baseline** — run analyzer against the unmodified workload.
3. **Diagnose** — map duplicates to inheritance, compaction, retry, or recovery events.
4. **Form hypothesis** — choose the dominant causal replay path.
5. **Implement improvement** — add stable references/deduplication/budget preflight at that boundary; do not discard required semantics.
6. **Measure again** — repeat the same workload and metrics.
7. **Improved?** — if no, re-evaluate once. Maximum optimization retries: 2.
8. **Verify** — independent Payload Budget Verifier checks metrics and acceptance evidence.

## Responsible agent
Runtime implementer owns stages 1–7. `subagents/payload-budget-verifier.md` owns final verification.

## Tools
Hashing, event/rollout parsers, token accounting, OS/network/storage metrics, workload tests, package script.

## Outputs
Baseline report, replay ledger, implementation change, after report, acceptance results, independent verification decision.

## Checkpoints
Baseline frozen before changes; hypothesis recorded before implementation; after metrics tied to same workload; verifier receives read-only evidence.

## Metrics
Replay ratio, replayed bytes, tokens/task, inherited bytes/child, network bytes, rollout growth, compaction count, acceptance pass rate.

## Retry policy
At most 2 implementation/measurement iterations. A failed acceptance test does not qualify as an optimization improvement.

## Stop conditions
Stop on missing lineage that prevents attribution, acceptance regression, two failed iterations, or any requirement to weaken correctness/security.

## Failure path
Preserve evidence, roll back the optimization, record the failing metric and hypothesis, then escalate to runtime architecture owner.

## Verification
Pass only when the verifier confirms lower amplification with comparable workload and no critical context loss.

## Definition of Done
Evidence documented; baseline captured; causal limitation identified; improvement implemented; tests pass; before/after metrics complete; risks documented; independent verification passes; no blocking issue remains.
