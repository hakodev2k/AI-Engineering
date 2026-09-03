# Research Evidence

## Topic
Agent Memory Pressure Admission Controller

## Category
Performance

## Problem
Agent runtimes can continue spawning workers, browser/computer-use children, or tool processes when the host is already under severe memory pressure. Advisory warnings, soft cleanup, and OS-level OOM behavior are insufficient: the new process can trigger page thrash, UI hangs, swap storms, or host crashes before useful work begins.

## Why it matters now
Fresh August 2026 issue reports across major coding-agent runtimes show resource admission is still weak. Claude Code issue #90208 (opened 2026-08-27) documents a background dispatcher detecting as little as 36 MB free, logging low memory, then still spawning an approximately 300 MB worker because the guard only hard-blocked speculative spare workers. OpenAI Codex issue #38877 (opened 2026-08-16) reports a Codex-started `node.exe` reaching roughly 55 GB virtual memory and a Windows host reboot after resource exhaustion. Codex issue #38720 (opened 2026-08-15) reports dozens of Computer Use processes spawning while idle and driving CPU/system lag. These are distinct implementations but expose the same engineering weakness: work admission is not consistently coupled to current resource headroom and expected child footprint.

## Affected users
Developers running coding agents on laptops/workstations, CI runners, shared development hosts, multi-project agent UIs, background-agent operators, and platform builders that dispatch local workers or browser/tool processes.

## Current public evidence

### Observed evidence
1. `anthropics/claude-code` issue #90208 reports a low-memory host with 826 MB RAM and no swap. The dispatcher logs low-memory conditions at 77 MB, 43 MB, and 36 MB free, attempts asynchronous cleanup, but proceeds to spawn an approximately 300 MB anonymous-heap worker. The host enters prolonged kernel reclaim/page thrash and requires manual termination.
2. The same issue identifies related reports where memory governors are too eager on macOS because `os.freemem()` under-represents reclaimable memory, while other paths fail to reap stale or settled workers. This shows that both measurement quality and admission action matter.
3. `openai/codex` issue #38877 reports a Codex-started Node process growing from ~33.9 GB to ~55.0 GB virtual memory in about one minute, Windows Resource Exhaustion events, and an automatic reboot after bugcheck.
4. `openai/codex` issue #38720 reports dozens of ChatGPT Computer Use processes spawning while idle after an August 15 update, causing near-100% CPU and severe system lag on macOS.

### Interpretation
The reusable problem is not a single leak. Agent systems need a hard resource-admission contract before spawning new work. That contract must measure usable memory correctly for the OS, include a conservative estimate of the new worker's footprint, reserve headroom for the parent/UI/kernel, and block or queue work when the projected state is unsafe. Cleanup should be awaited and re-measured rather than launched asynchronously while the spawn proceeds.

### Proposed solution
Add a deterministic memory admission controller that consumes current total/available memory plus estimated child working set and policy reserves. The controller returns ADMIT or BLOCK before spawn. Pair it with baseline measurement, bounded retry after reclamation, and post-spawn verification so performance claims are evidence-based.

## Existing approaches
- OS OOM killer or Windows Resource Exhaustion handling.
- Swap/pagefile expansion.
- Soft low-memory warnings.
- Reaping settled/spare workers.
- Fixed worker-count limits.
- Container/CI memory limits.
- Manual process cleanup or application restart.

## Remaining limitations
- OOM handling occurs after the unsafe work was admitted and can kill the wrong process.
- Swap can convert a crash into extreme latency rather than restore useful throughput.
- Fixed worker counts ignore worker-size variability and other host workloads.
- Raw free-memory readings differ by OS and can undercount reclaimable memory or ignore pressure/stall metrics.
- Asynchronous cleanup without awaiting completion does not create headroom before spawn.
- Advisory logs do not prevent resource amplification.
- Container limits protect the host but still allow the agent workload to thrash or restart repeatedly.

## Root-cause analysis
1. Admission decisions are based on intent (user-requested work should run) rather than projected resource safety.
2. Memory guards are advisory or apply only to speculative workers, leaving user-triggered paths ungated.
3. Worker footprint is not estimated from recent observations or a conservative configured baseline.
4. Cleanup and spawn are not serialized as reclaim -> remeasure -> decide.
5. Cross-platform memory signals are treated as equivalent despite different semantics.
6. Success metrics focus on task launch rather than system responsiveness, pressure, and useful completion.

## Improvement opportunity
Use a hard pre-spawn gate with explicit `minimum_free_bytes_after_spawn`, `reserve_fraction`, `estimated_worker_bytes`, and `max_projected_utilization`. On Linux, operators can additionally use `/proc/pressure/memory` as a stronger runtime pressure signal; on other platforms, feed platform-native available-memory measurements. Queue or reject unsafe work with a visible reason instead of relying on OOM behavior.

## Goal
Prevent new agent work from pushing the host into memory thrash or resource exhaustion while preserving throughput when sufficient headroom exists.

## Metrics
- Available bytes before and projected after spawn.
- Projected memory utilization.
- Spawn attempts blocked under unsafe headroom.
- Page/swap pressure before and after policy adoption.
- Worker crash/restart count.
- Host/UI responsiveness during concurrent workloads.
- Task throughput under safe admission.
- False-block rate on representative workloads.

## Trigger
Before spawning a background agent, subagent worker process, browser/computer-use process, local model/tool worker, or project session with material memory footprint.

## Inputs
Total memory, currently available memory, estimated child working set, configured reserve/headroom, optional active-worker observations, and platform pressure signals.

## Outputs
ADMIT/BLOCK decision, projected post-spawn headroom/utilization, reason codes, and measurement record.

## Relevant sources
- Claude Code issue #90208, opened 2026-08-27: https://github.com/anthropics/claude-code/issues/90208
- Claude Code related issue #85104 (linked from #90208), memory backpressure for warm children: https://github.com/anthropics/claude-code/issues/85104
- Claude Code related issue #87891 (linked from #90208), stale worker reaping: https://github.com/anthropics/claude-code/issues/87891
- OpenAI Codex issue #38877, opened 2026-08-16: https://github.com/openai/codex/issues/38877
- OpenAI Codex issue #38720, opened 2026-08-15: https://github.com/openai/codex/issues/38720
