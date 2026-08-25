# Workflow: Proactive Long-Context Evacuation

## Trigger
Context reaches the warning threshold, cache reuse degrades, or long-context transport errors appear.

## Goal
Prevent an unrecoverable session while preserving correctness-critical task state.

## Inputs
Telemetry, policy, current task state, model/provider limits.

## Baseline
Record tokens/task, occupancy, cache hit ratio/age, recent transport failures, retry count, and latency.

## Stages
1. **Observe** same-session telemetry.
2. **Measure** with `scripts/context_recovery_guard.py`.
3. **Diagnose** occupancy, reserve loss, cold cache, transport failure, or combination.
4. **Hypothesize** one action that changes the failing condition.
5. **Implement** allow, compact, or export-and-fork; never clear blindly.
6. **Measure again** with fresh occupancy/cache/error metrics.
7. **Verify** exported/imported goals, decisions, approvals, pending side effects, workspace identity, and verification state before mutations resume.

## Checkpoints
Before compaction; before session abandonment; after fresh-context import; before any side effect resumes.

## Metrics
Failed oversized requests, retries, tokens/task, latency, state-recovery completeness, regression rate.

## Retry policy
At most two telemetry refresh/reclassification attempts. A repeated oversized request without changed conditions is prohibited.

## Stop conditions
Complete when action is verified and post-action telemetry is healthy enough to continue. Stop immediately if state cannot be preserved.

## Failure path
Preserve the session/transcript, prevent further expensive retries, and escalate to a human operator.

## Definition of Done
Baseline captured; action justified; state preserved where required; fresh metrics collected; independent verification passed; no blocking issue remains.
