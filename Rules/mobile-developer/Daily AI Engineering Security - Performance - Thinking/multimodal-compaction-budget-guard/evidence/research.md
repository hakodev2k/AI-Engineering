# Research Evidence

## Topic
Multimodal Compaction Budget Guard

## Category
Token

## Problem
Text-only context budgeting can undercount retained images, allowing compacted history to keep large inline image/data-URL payloads. The resulting context remains near the compaction threshold, repeated compactions copy the same image bytes again, rollout storage grows rapidly, and forks/resumes can replay oversized multimodal history until requests fail.

## Why it matters now
OpenAI Codex issue #33493 remained open and was updated on 2026-08-20. It reports 224 compactions in a 4.16 GB rollout, 92 retained images, about 26.47 million inline image/base64 characters, and only ~8k tokens of post-compaction headroom. A newer issue, #39499 created 2026-08-19, reports a full-history fork with ~468 MB of rollout data, 20 historical compactions replayed in 1.6 seconds, individual records up to ~26.3 MB, repeated inline images, and Responses WebSocket closure before completion.

## Affected users
Developers using image-heavy coding-agent threads, UI/browser/computer-use agents, multimodal support workflows, long-running conversations with compaction, and platform teams persisting/forking agent history.

## Current public evidence
### Observed evidence
1. Codex #33493: compacted replacement history retains `input_image`; the report states the current path treats images as zero text tokens and preserves them. Measured post-compaction prompt remained ~236–237k against an ~244.8k threshold, causing repeated compaction. https://github.com/openai/codex/issues/33493
2. Codex #39499: a multimodal full-history fork repeatedly disconnected; read-only inspection found repeated inline image data, large compacted records, and burst replay of historical compactions. https://github.com/openai/codex/issues/39499

### Interpretation
The recurring failure is not simply “large context.” It is a mismatch between the resource being budgeted (mostly text tokens) and the resource being retained/persisted (text + image count + encoded bytes + estimated vision cost + historical snapshots). Compaction also lacks sufficient hysteresis when retained multimodal history lands too close to the trigger threshold.

## Existing approaches
- Text token budgeting/truncation.
- Context compaction and replacement history.
- Image resizing/detail estimation in some model paths.
- Session forking/resume and request retry.

## Remaining limitations
- Image count/encoded bytes can be effectively invisible to text-token budgets.
- Repeated snapshots can duplicate identical image payloads in persistent history.
- A compaction can technically fit yet leave too little headroom for a normal next turn.
- Generic retries cannot repair a deterministic oversized replay.
- Dropping all historical images would risk correctness for tasks that still depend on visual evidence.

## Root-cause analysis
1. Budget dimensions omit image bytes/count/estimated visual cost.
2. No explicit post-compaction headroom/hysteresis target.
3. Old image payloads remain inline rather than being referenced/deduplicated.
4. Superseded compaction snapshots may be replayed or persisted redundantly.
5. Quality preservation is not explicitly measured when evicting multimodal context.

## Improvement opportunity
Use a multi-dimensional budget: text tokens, estimated image tokens, image count, inline bytes, duplicate payload bytes, and minimum post-compaction headroom. Prefer newest/referenced visual evidence, deduplicate identical images by digest, replace evicted images with small provenance placeholders, and fail the compaction gate when required context cannot fit safely.

## Metrics
Input tokens/task, estimated image tokens, inline image bytes, unique/duplicate image bytes, retained image count, post-compaction headroom, compactions per 10 turns, rollout growth per turn, request failure rate, quality/regression score.

## Trigger
Before compaction; after compaction; before fork/resume materialization; or when multimodal context exceeds configured warning ratios.

## Inputs
Normalized history JSON, context window, compaction trigger threshold, required headroom, image count/byte limits, optional image token estimates, protected/recent evidence markers.

## Outputs
Budget report, duplicate digests, retain/evict candidates, PASS/BLOCK result, before/after metrics.

## Relevant sources
- https://github.com/openai/codex/issues/33493
- https://github.com/openai/codex/issues/39499
- https://github.com/openai/codex/issues/24550
- https://github.com/openai/codex/issues/34268
