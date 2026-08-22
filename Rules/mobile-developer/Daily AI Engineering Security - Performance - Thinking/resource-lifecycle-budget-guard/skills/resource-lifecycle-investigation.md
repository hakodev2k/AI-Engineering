# Skill: Resource Lifecycle Investigation

## Purpose
Find which AI-agent resources are leaking, who owns them, and whether cleanup actually restores the pre-task baseline.

## Trigger
Run when process/tab/client count grows across tasks, memory or CPU increases monotonically, the workstation degrades, or post-task cleanup exceeds its SLA.

## Inputs
Task/session ID, process snapshots, memory/CPU metrics, browser tab inventory, MCP/helper inventory, timestamps, lifecycle events.

## Preconditions
Capture a baseline before changing cleanup behavior. Use read-only observation first.

## Required context
Expected resource topology, parent/child relationships, browser/MCP configuration, task start/end/cancel timestamps.

## Allowed tools
OS process inspection, browser automation inventory, logs, deterministic scripts, metrics exporters.

## Constraints
Do not kill unrelated user processes. Do not infer ownership from process name alone. Never weaken sandbox/security controls to improve resource usage.

## Procedure
1. Capture baseline counts and resource usage.
2. Build an ownership map from PID/client/tab/resource to task/session and creation event.
3. Reproduce one bounded task and sample resources at fixed checkpoints.
4. Distinguish expected persistent pools from task-scoped resources.
5. Identify resources alive past their lease expiry.
6. Measure cleanup latency after success, cancellation, timeout, and crash simulation.
7. Form one hypothesis per leak path and change only one lifecycle mechanism per retry.
8. Re-run the same workload and compare before/after growth slope and postcondition.

## Decision points
- If ownership cannot be proven, mark the resource `unknown` and do not terminate it automatically.
- If a process exceeds a hard memory budget or creates system-wide pressure, stop new work and enter controlled cleanup.
- If resource growth is expected pooled capacity, prove that it plateaus under repeated tasks.

## Expected output
Ownership ledger, baseline and peak metrics, orphan list, cleanup latency, root-cause hypothesis, and verification result.

## Metrics
Owned process count, orphan count, peak RSS/private bytes, browser tabs, MCP clients, CPU %, handles, cleanup latency, slope per completed task.

## Verification
After N repeated tasks, resource count and memory must return to or remain within configured tolerance of baseline. Cancellation and failure paths must satisfy the same cleanup postconditions.

## Failure handling
Retry diagnosis/cleanup changes at most twice. Escalate when ownership is ambiguous, cleanup requires destructive host action, or hard budget remains exceeded.

## Stop conditions
Stop on unrelated-process risk, persistent hard-budget violation, two failed remediation cycles, or inability to collect trustworthy ownership evidence.