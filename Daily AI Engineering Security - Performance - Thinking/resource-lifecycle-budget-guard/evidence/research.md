# Research Evidence

## Topic
Resource Lifecycle Budget Guard

## Category
Performance

## Problem
Long-running AI coding and browser-assisted sessions can leak or accumulate helper processes, Node/MCP workers, browser tabs, memory, handles, and accessibility/computer-use clients. The degradation is progressive, can outlive the visible task, and in severe cases affects the whole workstation.

## Why it matters now
Recent August 2026 reports in `openai/codex` show multiple independent resource-lifecycle failures across Windows and macOS: process/tab accumulation, runaway Node memory, repeated Computer History clients, and system-wide input/UI stalls.

## Affected users
Developers running Codex/ChatGPT Work locally, browser/computer-use workflows, MCP users, long-running agent sessions, and platform teams embedding local helper runtimes.

## Current public evidence
### Observed evidence
1. `openai/codex#39062` reports ChatGPT/Codex processes and Chrome tabs accumulating during extended Windows work; quitting the visible app may not restore responsiveness until remaining processes are manually killed.
2. `openai/codex#38877` reports a Codex-started `node.exe` growing from about 33.9 GB to 55.0 GB virtual memory within roughly one minute before Windows resource exhaustion and reboot; controlled reproduction showed rapid growth during one run.
3. `openai/codex#38873` reports 5 simultaneous Computer History MCP clients, 71–83% CPU usage, and repeated 10–13 second IntelliJ UI freezes correlated with accessibility traversal.
4. `openai/codex#38874` reports system-wide mouse/input stutter with large retained diagnostic state and renderer stalls, showing that local agent resource pressure can escape the app boundary.

### Interpretation
These reports point to a reusable engineering problem: resource ownership and lifetime are not always explicit across task, thread, plugin, browser, MCP, and desktop-process boundaries. Cleanup often depends on normal task completion, while crashes, cancellations, retries, or cross-surface transitions can leave resources alive. Static limits alone are insufficient without attribution, leases, cleanup verification, and regression measurement.

## Existing approaches
- OS process cleanup on parent exit.
- Task cancellation and plugin shutdown hooks.
- Browser tab reuse/close logic.
- MCP process supervision.
- Manual restart, Task Manager/process kill, or disabling browser/computer-use features.

## Remaining limitations
- Parent/child process ownership may span several runtimes.
- Browser tabs and MCP helpers can survive logical task completion.
- Memory/CPU thresholds are often detected only after user-visible degradation.
- Cancellation does not prove cleanup actually happened.
- Long-running sessions need bounded resource growth, not merely eventual cleanup.

## Root-cause analysis
1. Missing resource lease keyed to task/session owner.
2. No invariant tying logical completion/cancellation to zero orphaned owned resources.
3. Weak telemetry for process count, RSS/private bytes, tab count, handles, helper age, and cleanup latency.
4. Retry/reconnect paths can create replacements without retiring predecessors.
5. Cleanup is action-based rather than postcondition-verified.

## Improvement opportunity
Create a reusable lifecycle guard that records a baseline, assigns leases to spawned resources, continuously enforces per-task/global budgets, detects monotonic growth, performs bounded graceful cleanup followed by safe escalation, and independently verifies postconditions after task completion/cancellation.

## Relevant sources
- https://github.com/openai/codex/issues/39062
- https://github.com/openai/codex/issues/38877
- https://github.com/openai/codex/issues/38873
- https://github.com/openai/codex/issues/38874
