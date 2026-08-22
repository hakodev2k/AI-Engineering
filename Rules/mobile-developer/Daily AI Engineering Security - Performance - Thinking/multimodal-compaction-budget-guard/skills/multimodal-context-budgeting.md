# Skill: Multimodal Context Budgeting

## Purpose
Measure and constrain multimodal context using text, image, byte, duplication, and headroom dimensions instead of text tokens alone.

## Trigger
Run before/after compaction and before fork/resume reconstruction when history contains images or image-bearing tool output.

## Inputs
Normalized JSON history, context-window size, trigger threshold, required headroom, maximum retained images, maximum inline image bytes, optional per-image token estimates.

## Preconditions
History is readable without mutation. Critical/recent visual evidence can be marked protected when correctness depends on it.

## Required context
Task quality requirements, protected evidence, latest compaction boundary, model context limits.

## Allowed tools
Read-only history parser, token/byte estimator, SHA-256 duplicate detector, deterministic budget script.

## Constraints
MUST NOT remove protected context only to reduce cost. MUST measure baseline first. MUST preserve provenance when an image is evicted/replaced. MUST not claim token savings from encoded-byte reduction unless token accounting supports that claim.

## Procedure
1. Capture baseline: text estimate, image count, inline bytes, duplicate bytes, estimated image tokens if available, threshold and headroom.
2. Hash inline image/data-URL payloads and identify duplicates.
3. Separate protected/recent visual evidence from stale/superseded evidence.
4. Apply deduplication first; reuse references/digests when the storage format supports it.
5. Enforce image-count and inline-byte budgets, preferring newest relevant evidence.
6. Require post-compaction context to fall below `trigger - required_headroom`.
7. Re-measure all metrics.
8. Run task-quality/regression checks using the same acceptance criteria as baseline.
9. If quality regresses, restore necessary evidence and stop after at most two optimization attempts.

## Decision points
- Required/protected image exceeds budget: BLOCK and escalate rather than silently drop it.
- Duplicate payload: deduplicate/reference first.
- Headroom below configured minimum after compaction: BLOCK completion.
- Quality regression: reject optimization.

## Expected output
Before/after budget report, duplicate digest inventory, retained/evicted counts, headroom, quality result, PASS/BLOCK status.

## Metrics
Tokens/task, image count, unique/duplicate bytes, estimated image tokens, context utilization, post-compaction headroom, compaction frequency, rollout growth, request failures, quality regression rate.

## Verification
Budget PASS plus unchanged/better task acceptance result. Lower bytes alone is not sufficient.

## Failure handling
Maximum two optimization attempts. Preserve protected evidence, record blocking dimension, and escalate when required context cannot fit safely.

## Stop conditions
Budget satisfied and verified; protected context cannot fit; quality regression persists; or two optimization attempts fail.