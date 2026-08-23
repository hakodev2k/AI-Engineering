# Skill: Analyze Browser Observation Budget

## Purpose
Measure browser observation cost before optimizing and identify which DOM/screenshot outputs are duplicate, oversized, stale, or unnecessarily multimodal.

## Trigger
Browser-heavy task exceeds its latency/token target, compacts early, repeats navigation, or is about to append a large observation.

## Inputs
JSONL browser observation events with `type`, `content` or `bytes`, `page`, `step`, and optional `required_full`.

## Preconditions
Capture a baseline from an unmodified representative workflow. Do not optimize solely from anecdotal latency.

## Required context
Task completion criteria, model context budget, browser-tool semantics, and which decisions require visual versus DOM evidence.

## Allowed tools
Static profiler, session telemetry, browser trace metadata, token estimator, deterministic hashing.

## Constraints
- Never remove context required for correctness.
- Do not claim improvement without before/after measurement.
- Full observations may be admitted when explicitly required by the next decision.
- Do not treat byte savings alone as success if task quality regresses.

## Procedure
1. Measure baseline observation bytes, estimated tokens, full snapshot count, screenshot count, duplicate ratio, compactions, and task completion.
2. Run `scripts/observation_budget.py` on the trace.
3. Rank events by estimated token contribution and duplicate fingerprint frequency.
4. Identify stable page observations repeated after small actions.
5. Determine whether DOM and screenshot were both required for the same step.
6. Form one optimization hypothesis at a time: deduplicate, target subtree/locator, use delta, choose one modality, or evict stale observations.
7. Re-run the same workflow and compare metrics.
8. Reject the optimization if completion quality or required evidence degrades.

## Decision points
- Duplicate and not `required_full`: suppress/reuse prior observation.
- Over per-event budget and full view not required: request targeted/delta observation.
- Full view required: admit and record budget escalation.
- Quality regression: restore required context and re-diagnose.

## Expected output
Before/after budget report with attribution and an explicit admission policy change.

## Metrics
Tokens/task, browser-observation tokens/task, duplicate ratio, p50/p95 observation size, compactions, latency, completion rate, regression rate.

## Verification
Regression fixtures pass and representative task quality is unchanged or improved while browser observation volume falls measurably.

## Failure handling
If tokenization is unavailable, use documented byte-to-token estimation and label it estimated. If traces lack content, hash/size-based duplicate detection may be partial and must be reported as such.

## Stop conditions
At most three optimization hypotheses per investigation. Stop when the target is met or further reduction would remove required evidence.
