# Workflow: Spawn Freshness Verification

## Trigger
A parent intends to spawn or resume a subagent.

## Goal
Prevent delegated planning/execution on stale project instruction or memory snapshots.

## Inputs
Repository root, critical file list, current epoch manifest.

## Baseline
Record whether delegation currently lacks a deterministic freshness check and any known stale-spawn incidents.

## Context
Use observable files, hashes, lifecycle events, and outputs; never request hidden chain-of-thought.

## Stages
1. Observe the delegation and critical dependencies.
2. Measure baseline with the checker.
3. Diagnose exactly which files changed.
4. Form the hypothesis that child bootstrap may not reflect those changes.
5. Refresh through a supported lifecycle path or postpone delegation.
6. Measure again with a new epoch.
7. Independent verifier confirms equality.
8. Complete only when `fresh=true`.

## Responsible agent
Parent orchestrator refreshes; Context Freshness Verifier verifies.

## Tools
`scripts/context_epoch_guard.py` and the host-native spawn/resume mechanism.

## Outputs
Epoch manifest, checker result, verifier decision.

## Checkpoints
Before spawn and after each refresh.

## Metrics
Stale-spawn blocks, refresh retries, added pre-spawn latency, stale-context rework.

## Retry policy
Maximum two refresh/recheck attempts.

## Stop conditions
Fresh and independently verified, or blocked after two failed attempts.

## Failure path
Preserve evidence, do not delegate, and escalate. Never remove critical context to force success.

## Verification
Run deterministic tests and intentionally mutate one critical file between snapshot and check.

## Definition of Done
Current epoch verified, no unresolved drift, bounded loop respected, and delegation uses the verified epoch.
