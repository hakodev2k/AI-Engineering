# Skill: Hook Liveness Investigation

## Purpose
Diagnose hook-induced stalls using observable lifecycle evidence and establish a baseline before changing runtime behavior.

## Trigger
A session stalls around SessionStart, PreToolUse, PostToolUse, Stop, permission checks, or batched hooks; or hook duration exceeds its SLO.

## Inputs
Hook configuration, event log, process list snapshot, host/platform, reproduction command, expected timeout.

## Preconditions
Reproduce in a disposable workspace. Preserve original logs. Do not disable security hooks merely to make a run pass.

## Required context
Hook event name, hook identifier, parent PID, child PID when available, declared timeout, batch width, tool/session state.

## Allowed tools
Read-only log inspection, process inspection, deterministic test commands, the package watchdog and unit tests.

## Constraints
Never expose secrets from hook stdin/environment. Never terminate unrelated processes. Do not infer success from process disappearance alone.

## Procedure
1. Capture baseline elapsed time and last host event.
2. Correlate every `hook_started` with a terminal response by stable hook id.
3. Identify unmatched starts and measure age using monotonic timestamps when available.
4. Inspect whether the child is running, sleeping, blocked on I/O, or wedged before user code.
5. Determine whether timeout ownership is parent-side or child-side.
6. Reproduce with a harmless sleep fixture under `scripts/hook_watchdog.py`.
7. Compare baseline and guarded behavior: elapsed time, terminal-event coverage, orphan processes.
8. Record the smallest proven failure mechanism and evidence.

## Decision points
- Unmatched start older than deadline: classify `timeout/liveness`.
- Child exits but host never settles: classify `join/correlation`.
- Host settles but process tree survives: classify `cleanup`.
- No hook start exists: this package is not the primary control; investigate dispatch/enforcement.

## Expected output
Facts, measured baseline, failure class, implicated lifecycle invariant, proposed change, verification evidence.

## Metrics
Unmatched lifecycle records; p95 duration; timeout enforcement error; surviving descendants; recovered session rate.

## Verification
The same fixture must fail/stall under the vulnerable path and terminate within the configured bound under the guard, without orphan descendants.

## Failure handling
If process ownership cannot be established, do not kill by name. Capture evidence and escalate to the runtime owner.

## Stop conditions
Stop after one minimal reproduction and one guarded verification pass, or after 3 failed reproduction attempts with preserved evidence.