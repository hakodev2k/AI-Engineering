# Research — Headless First-Event Regression Gate

## Topic
Headless AI CLI first-event latency regressions

## Category
Performance

## Problem
Non-interactive AI CLI invocations can remain functionally correct while acquiring large fixed startup/handshake delays before the first usable stream event. Scheduled jobs, CI agents, wrappers and short-lived automation pay this cost on every invocation, and ordinary end-to-end success checks do not identify where the regression starts.

## Why it matters now
Fresh August 2026 Claude Code reports show both a repeatable sub-second-to-second first-stream regression across versions and a separate fixed ~405-second early-session stall affecting headless runs. These failures are especially expensive in automation because they consume wall-clock budgets before useful work starts and can turn previously reliable jobs into timeout failures.

## Affected users
- CI/CD and scheduled-agent operators using one-shot AI CLI calls.
- Platform teams embedding coding agents behind services or job workers.
- Developers evaluating client upgrades where total completion time is noisy.
- Reliability teams diagnosing whether latency is process startup, initialization, provider handshake, deferred tool loading, or downstream execution.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #87652, opened 2026-08-18, reports checksum-verified Linux arm64 measurements across releases. Median first stdout rose from 1,553 ms on 2.1.197 to 2,194 ms on 2.1.200 and 2,295 ms on 2.1.222; ordinary `--version` startup changed only slightly, pointing to initialization/handshake rather than binary loading. The reporter also found `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` did not remove the delay. Source: https://github.com/anthropics/claude-code/issues/87652
2. Anthropic Claude Code issue #83859, opened 2026-08-04, reports headless `claude -p` runs stalling about 398–412 seconds once per session, 9/9 runs, after previously completing without the stall. The fixed duration suggested a timeout/retry path rather than load-dependent latency and caused 10-minute automation budgets to fail. Source: https://github.com/anthropics/claude-code/issues/83859
3. Anthropic Claude Code issue #85791, opened 2026-08-11, reports intermittent response latency up to about 15 minutes in both Desktop and CLI, cleared only by fully quitting/restarting, demonstrating that long fixed latency can be stateful and invisible to a simple command-success check. Source: https://github.com/anthropics/claude-code/issues/85791

### Interpretation
The independent reports do not prove one shared root cause. They do establish a recurring operational class: first-use/early-session latency can regress independently from tool execution time and final correctness. Teams therefore need milestone-level timing and upgrade gates, not only total-duration monitoring.

## Existing approaches
- End-to-end job timeouts.
- Pinning a known-good client version.
- Manual stopwatch comparisons during incident diagnosis.
- Generic APM around the outer process.
- Vendor-side telemetry and issue reports.

## Remaining limitations
- A single total-duration metric cannot distinguish process spawn, first stdout, first structured provider event and total completion.
- Pinning indefinitely trades performance stability for missed fixes and features.
- One or two manual samples are vulnerable to network/provider noise.
- Generic process monitoring does not produce reproducible version-to-version evidence with fixed prompt/model/schema inputs.
- Increasing timeouts hides regressions and increases failure detection time.

## Root-cause analysis
Likely root-cause families include added eager initialization, authentication/session negotiation, deferred-tool loading, network retry/timeout paths, cache/config migration, or state retained across runs. The package does not assume which is responsible. It isolates the earliest measurable milestone that regressed and requires controlled comparisons before optimization claims.

## Improvement opportunity
Create a deterministic benchmark harness that records spawn-to-first-byte and total duration over repeated samples, produces machine-readable summaries, and blocks upgrades when robust median/p95 thresholds regress. Keep the benchmark command, environment and fixture fixed; then use targeted diagnostics only after the regression is established.

## Goal
Detect headless startup/first-event regressions before rollout and localize them to an early milestone with reproducible evidence.

## Metrics
- first-byte median and p95 milliseconds
- total median and p95 milliseconds
- timeout/failure rate
- regression ratio versus baseline
- sample count and successful-sample count

## Trigger
Client/runtime upgrade, dependency refresh, agent image rebuild, or unexplained increase in headless task latency.

## Inputs
Candidate command, baseline result JSON, repeat count, timeout, thresholds, fixed prompt/model/tool/schema configuration owned by the caller.

## Outputs
Measured JSON, comparison verdict, blocking exit code, diagnostic evidence.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/87652
- https://github.com/anthropics/claude-code/issues/83859
- https://github.com/anthropics/claude-code/issues/85791
