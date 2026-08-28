# Skill: Image Context Baseline
## Purpose
Measure multimodal context amplification before changing agent orchestration.
## Trigger
Any image-heavy task with subagents, retries, compaction, rising disk/memory use, or unexplained latency/token growth.
## Inputs
Normalized per-turn telemetry: thread/parent IDs, input and cached tokens, image/inherited bytes, rollout bytes, latency.
## Preconditions
Representative task and stable model/tool configuration.
## Required context
Task topology and quality requirements; raw image content is not required for measurement.
## Allowed tools
Read-only telemetry collection, filesystem size inspection, model usage logs, `scripts/image_context_budget.py`.
## Constraints
MUST NOT delete artifacts during baseline. MUST NOT remove context required for correctness.
## Procedure
1. Capture one healthy or representative task family.
2. Normalize telemetry into JSONL.
3. Run the budget script with current policy.
4. Record task-family topology and the highest amplification dimensions.
5. Form a single testable hypothesis: e.g. child inheritance, compaction reserialization, or stale generation retention.
6. Apply one bounded change such as reference-only handoff or selected-image handoff.
7. Re-run the same workload and compare p50/p95 latency, input tokens, inherited bytes and rollout growth.
## Decision points
If quality declines, restore required context and choose a different optimization. If no metric improves after two revisions, stop and escalate.
## Expected output
Before/after metrics, hypothesis, change, result, quality status, remaining risk.
## Metrics
Input tokens/turn, cached fraction, inherited image bytes/child, task-family rollout bytes, p95 latency, descendants.
## Verification
Independent verifier checks comparable workload and no quality/security weakening.
## Failure handling
Preserve baseline evidence; revert optimization if task correctness regresses.
## Stop conditions
Maximum two optimization revisions or any unsafe/destructive cleanup requirement.
