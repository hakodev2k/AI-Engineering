# Research — Windows Desktop Resource Regression Gate

## Topic
Detect and gate AI desktop builds that cause system-wide Windows resource and input-latency regressions.

## Category
Performance

## Problem
An AI coding desktop client can remain apparently idle while consuming sustained CPU, extreme disk read bandwidth, memory, or repeatedly respawning integration processes. The resulting contention degrades keyboard/mouse responsiveness and other applications.

## Why it matters now
Multiple independent August 2026 reports describe this regression class in current Codex/ChatGPT Windows desktop builds, with measured CPU, I/O and system-wide input effects.

## Affected users
Windows developers, teams using MCP/native integrations, support and release engineers, and platform owners validating managed desktop images.

## Current public evidence
### Observed evidence
1. OpenAI Codex #38777, opened 2026-08-15, reports a measured ~50x increase in input-delivery stalls while Codex runs on Windows 11: https://github.com/openai/codex/issues/38777
2. #38506, opened 2026-08-14, reports memory rising to ~6.4 GB and ~235 MB/s disk activity with system-wide mouse lag: https://github.com/openai/codex/issues/38506
3. #38702, opened 2026-08-15, reports ~1.1–1.5 GB/s read I/O after hours idle with severe pointer/UI lag: https://github.com/openai/codex/issues/38702
4. #37372, opened 2026-08-07, reports the Windows desktop UI process sustaining roughly one logical CPU while idle: https://github.com/openai/codex/issues/37372
5. #37402, opened 2026-08-07, attributes one variant to MCP fleet kill/respawn plus re-fetches that drive kernel/Defender CPU and input stutter: https://github.com/openai/codex/issues/37402
6. #38510, opened 2026-08-14, reports a Chrome native-host retry loop consuming a CPU core and causing input lag: https://github.com/openai/codex/issues/38510

### Interpretation
The independent reports support a recurring symptom family with different immediate causes: UI spin, integration respawn loops, native-host retries, memory growth and read-I/O storms. A reusable detector should measure symptoms and process-tree attribution rather than hard-code one cause.

## Existing approaches
Task Manager inspection, manual process killing, app restart, disabling integrations, product downgrade, ad-hoc PerfMon traces and bug-specific diagnostics.

## Remaining limitations
Manual observation is not reproducible; restart can hide long-idle regressions; disabling integrations can mask rather than fix defects; release validation often measures task latency but not host health; one metric misses multi-cause failures.

## Root-cause analysis
1. Desktop shells, renderers, local agent backends, native hosts and MCP subprocesses have independent lifecycle/retry behavior.
2. Idle-state invariants are weakly tested compared with task correctness.
3. Integration retries amplify into CPU/filesystem/network/endpoint-security work.
4. Regressions may require dwell time, so short smoke tests miss them.
5. Host input latency is downstream of contention and rarely part of agent performance gates.

## Improvement opportunity
Use a dependency-free Windows process-tree probe plus baseline/verification workflow. Gate sustained rather than single-sample violations, preserve raw measurements, track descendant churn, and compare like-for-like runs.

## Goal
Catch severe host-impact regressions before rollout and distinguish CPU spin, I/O storm, memory growth and process churn.

## Metrics
CPU %, read/write bytes/sec, working-set MB, process count, PID churn, sustained breaches, duration and sample count.

## Trigger
Desktop upgrade, integration change, managed-image release, incident reproduction or host-lag report.

## Inputs
Process name/PID, duration, sample interval, threshold policy.

## Outputs
JSON report, breach list and deterministic exit code.

## Verification
Use equivalent hardware/workload states. Improvement requires before/after evidence and no disabled security control.
