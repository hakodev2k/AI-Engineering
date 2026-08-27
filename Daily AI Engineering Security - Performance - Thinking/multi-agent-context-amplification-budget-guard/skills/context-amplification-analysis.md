# Skill: Context Amplification Analysis

## Purpose
Measure and control token/context multiplication before subagent fan-out.

## Trigger
Any child-agent dispatch, image-heavy context, repeated compaction, mixed-model setup, or abnormal cache-read/token growth.

## Inputs
Parent token estimate, required child context, static instructions, asset metadata/digests, fan-out count, expected child turns, child model context window.

## Preconditions
Required security/authorization context is labeled non-evictable.

## Required context
Task requirements, relevant evidence, security policy, acceptance criteria, child model limits.

## Allowed tools
Token counters, context profilers, file hashes, usage traces, deterministic budget guard.

## Constraints
- MUST NOT remove correctness-critical or security-critical context merely to save tokens.
- MUST measure baseline before optimization.
- MUST use child-specific context-window limits.
- MUST deduplicate immutable payloads where semantics permit.
- SHOULD use references/summaries for large assets when the child does not need raw bytes.

## Procedure
1. Measure parent and proposed child context.
2. Separate non-evictable policy/requirements from optional inherited history.
3. Deduplicate stable artifacts by digest.
4. Estimate per-child tokens and expected repeated-turn cost.
5. Compute aggregate amplification.
6. Run the guard.
7. If blocked, reduce fan-out or optional context, then retry at most twice.
8. Execute representative task.
9. Measure actual token/network/latency and quality outcome.
10. Compare against baseline.

## Decision points
Allow only within child window and amplification budgets. Reduce context when optional inherited tokens dominate. Block fan-out if budgets cannot be met safely.

## Expected output
Budget decision plus measured before/after metrics.

## Metrics
Tokens/task, amplification factor, duplicated bytes, cache-read tokens, compactions, quality regression.

## Verification
Independent reviewer checks that non-evictable context remains present and quality tests pass.

## Failure handling
Fail closed on unknown child context limit or missing required-context classification.

## Stop conditions
Two failed optimization attempts; required context cannot fit; quality/security regression detected.
