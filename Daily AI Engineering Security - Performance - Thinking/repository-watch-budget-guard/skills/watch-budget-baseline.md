# Skill: Watch Budget Baseline

## Purpose
Measure Linux inotify pressure before an AI client creates or expands repository watchers.

## Trigger
Before watcher startup, on task attach, after repository-root changes, or after any `ENOSPC`/watch-limit error.

## Inputs
Target PID(s), repository root(s), soft utilization threshold, required emergency headroom.

## Preconditions
Linux `/proc` and `/proc/sys/fs/inotify` are readable. Measurement is read-only.

## Allowed tools
`/proc`, sysctl files, process metadata, `scripts/inotify_budget.py`.

## Constraints
MUST NOT raise system limits automatically. MUST NOT kill processes or remove watches. MUST preserve headroom for other applications.

## Procedure
1. Read `max_user_watches` and `max_user_instances`.
2. Count current inotify watches and instances for target processes and, where permissions allow, the current user.
3. Record baseline and utilization.
4. Estimate incremental watches for the repository scope or compare with a prior start delta.
5. Classify PASS when projected utilization remains below the configured soft ceiling; FALLBACK when the client can use bounded polling; BLOCK otherwise.
6. After watcher start/stop, measure again and calculate allocation/release delta.

## Decision points
At >=80% user-watch utilization, new recursive watchers SHOULD use fallback. At >=90%, new broad watchers MUST be blocked unless an operator explicitly changes capacity after reviewing memory impact.

## Expected output
JSON baseline with limits, measured watches/instances, utilization, target PID contribution, decision, and reasons.

## Metrics
Watch utilization, target-process share, watcher-start delta, release ratio, ENOSPC events.

## Verification
Repeat measurement after start and teardown; release ratio should approach 100% for task-owned watches that are no longer needed.

## Failure handling
If `/proc` is unreadable, return UNKNOWN and block claims of safe headroom. Retry once after permission/context correction.

## Stop conditions
Two failed measurements, unsupported OS, or inability to determine safe headroom.