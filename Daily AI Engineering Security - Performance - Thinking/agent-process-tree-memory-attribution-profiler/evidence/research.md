# Research

## Topic
Process-tree memory attribution for AI coding runtimes

## Category
Performance

## Problem
Resource regressions in agent runtimes are frequently observed as “the agent uses too much memory,” but the actual allocation can live in a descendant, helper, embedded command, renderer, MCP pool, parser, or app-server component. Root-only or name-only monitoring can therefore send investigation toward the wrong subsystem.

## Why it matters now
Current coding agents increasingly embed tools and maintain long-lived multi-process runtimes. Memory faults now range from native allocations inside the host executable to leaked child process pools, and can exhaust tens of gigabytes.

## Affected users
Coding-agent users, desktop/IDE extension teams, MCP platform engineers, performance teams, and CI maintainers running long soak tests.

## Current public evidence
### Observed evidence
1. Claude Code issue #86942, opened 2026-08-15: an embedded `ugrep` command shim allocates about 235 MB/s until OOM on some patterns. Because it executes through the Claude binary, the growing process appears as `claude`; reproducing normal GNU grep outside the session does not reproduce the problem. https://github.com/anthropics/claude-code/issues/86942
2. Claude Code issue #86984, opened 2026-08-15: diagnostics show RSS materially above the JS heap, with native/unaccounted memory and a reported extreme growth rate, demonstrating that heap snapshots alone can miss the relevant allocation class. https://github.com/anthropics/claude-code/issues/86984
3. Codex issue #38537, August 2026: session-scoped MCP child sets accumulate under long-lived app-server; 490 processes and 26.5 GB resident were observed. https://github.com/openai/codex/issues/38537
4. Codex issue #24991 reports sustained resource pressure spread across renderer, GPU helper and app-server, with renderer processes accumulating. https://github.com/openai/codex/issues/24991
5. Codex issue #29317 reports an internal PowerShell AST parser process growing to about 185 GB committed memory on Windows, exhausting host resources. https://github.com/openai/codex/issues/29317

## Existing approaches
Task Manager/top/Activity Monitor, root-process RSS monitoring, language heap snapshots, manual `ps` trees, restarts, and component-specific leak fixes.

## Remaining limitations
Process names may conceal embedded tools; root RSS omits descendant pools; heap snapshots omit native/external memory; point-in-time snapshots do not establish growth; and aggregate host pressure does not identify which process family should be fixed.

## Root-cause analysis
1. Agent hosts compose several runtimes with independent allocation/lifecycle behavior.
2. Monitoring often follows a single PID or executable name rather than ownership lineage.
3. Native/child allocations fall outside language-level heap instrumentation.
4. Lack of a comparable baseline makes normal cache warm-up indistinguishable from sustained leak slope.

## Interpretation
These reports do not establish one universal leak mechanism. They establish that fault localization itself is a recurring engineering problem: the same user-visible symptom can come from root native memory, embedded binaries, or descendants.

## Improvement opportunity
Make process-tree attribution a standard precondition for memory optimization: sample root plus descendants, measure growth over time, rank contributors, and compare against a workload-matched baseline before changing runtime code.

## Proposed solution
A deterministic offline analyzer reconstructs descendants per timestamp from PID/PPID records, computes root/child/tree RSS and slope, ranks labels/PIDs by peak contribution, and gates regression against explicit thresholds or a baseline.

## Metrics
Peak tree RSS, root vs child growth, MiB/min slope, max descendant count, top contributor share, baseline delta, reproducibility across soak runs.

## Trigger / Inputs / Outputs
Trigger: long-session memory complaint or performance regression test. Inputs: timestamped process samples, root PID, policy, optional baseline. Outputs: attribution metrics, top contributors, threshold violations, pass/regression status.
