# Research — Hook Parent Timeout Liveness Guard

## Topic
Parent-enforced liveness for agent hook subprocesses

## Category
Performance

## Problem
Agent hook systems can block an entire interactive or headless session when a hook process never reaches user code, never exits, or waits indefinitely. A timeout declared inside hook configuration is insufficient if the host does not enforce it from the parent process.

## Why it matters now
Hook systems are increasingly used for policy checks, approvals, formatting, security review, telemetry, and workflow automation. A wedged hook therefore becomes a critical-path availability failure, and wide hook batches increase the probability of one unresolved child stalling the whole batch.

## Affected users
Developers using coding agents with hooks; teams running non-interactive agents; platform engineers embedding hook runners; security teams relying on PreToolUse/PostToolUse enforcement.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #85250, opened 2026-08-09, reports a declared hook timeout not enforced parent-side when a Node subprocess wedges before JavaScript starts. Seven of eight hooks complete while one has `hook_started` without `hook_response`; the whole session remains frozen. https://github.com/anthropics/claude-code/issues/85250
2. Claude Code issue #50160 documents SessionStart hooks without a finite timeout blocking CLI/SDK startup indefinitely, with a measured 354-second silent gap; adding a timeout materially reduced the stall. https://github.com/anthropics/claude-code/issues/50160
3. Claude Code issue #46177 reports Windows hook processes reading stdin freezing sessions indefinitely, demonstrating a second hang mechanism at the hook boundary. https://github.com/anthropics/claude-code/issues/46177
4. Claude Code issue #44435 reports PreToolUse hook races producing opaque permission-stream failure and notes finite timeout as a local mitigation. https://github.com/anthropics/claude-code/issues/44435

### Existing approaches
Per-hook timeout fields; in-hook timers; agent-level watchdogs; manual process termination; external job timeouts.

### Remaining limitations
In-hook timers cannot execute when interpreter startup wedges. Agent-level timeouts are too coarse and lose hook identity. Manual termination is unsuitable for headless execution. A batch await often lacks per-child deadline, terminal event synthesis, and process-tree cleanup.

## Root-cause analysis
- Liveness ownership is delegated to untrusted/unreliable child code instead of retained by the parent.
- Hook lifecycle lacks an invariant that every `hook_started` reaches exactly one terminal state.
- Process-tree cleanup is platform-sensitive and often omitted.
- Batch joins wait for all children without a bounded deadline.
- Timeout failures are not represented as structured evidence, so supervisors cannot distinguish slow work from a dead hook.

## Improvement opportunity
Provide a reusable parent-side supervisor that starts hooks in isolated process groups, applies a monotonic deadline, terminates the full process tree on expiry, emits exactly one terminal JSON record, and returns deterministic exit codes. Pair it with a hook-lifecycle ledger and a bounded batch workflow.

## Goal
No hook can leave a session waiting indefinitely; every started hook resolves as success, failure, or timeout with attributable evidence.

## Metrics
p50/p95 hook duration; timeout count; unresolved-hook count; batch critical-path duration; orphan-process count; session stalls attributable to hooks.

## Trigger
Before executing any synchronous hook that blocks model/tool/session progress.

## Inputs
Command argv, timeout seconds, working directory, optional environment allowlist.

## Outputs
Structured terminal record, exit code, elapsed time, timeout flag, captured bounded stdout/stderr.

## Verification
Use deterministic tests for success, nonzero exit, timeout, and child-process cleanup. A package is verified only if a deliberately sleeping hook is terminated within deadline tolerance and the caller receives a terminal record.

## Interpretation
Current reports show a host-level liveness gap, not merely badly written hook scripts. Parent ownership of deadlines is therefore the reusable control boundary.

## Proposed solution
The package implements a dependency-free Python watchdog plus enforceable rules, workflow, hook contract, specialized investigator/verifier roles, and tests.