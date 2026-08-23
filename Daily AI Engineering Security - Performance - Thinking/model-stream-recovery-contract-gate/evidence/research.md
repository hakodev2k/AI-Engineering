# Research — Model Stream Recovery Contract Gate

## Topic
Preserve truthful terminal-state classification and recovery dispatch when model streams stall or fail.

## Category
Thinking

## Problem
Agent runtimes make planning and recovery decisions from terminal events. Current failures show model/watchdog faults can be surfaced as user interruption, while stream-stall termination can move to a failure-hook path that fires but cannot request continuation. The system therefore loses the distinction between human intent, provider failure and recoverable transport failure.

## Why it matters now
Recent August 2026 Claude Code reports contain transcript-level timing and hook evidence showing this is active in current long-running and subagent workflows, particularly unattended sessions and unstable network/model conditions.

## Affected users
Developers running long autonomous sessions, multi-agent/subagent systems, hook authors, remote operators, CI/headless agents and platform teams implementing recovery orchestration.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #87972, opened 2026-08-19, reports stream-stall-terminated turns changed from a working `Stop` recovery path to `StopFailure`; the failure hook fires but its block/continue decision is ignored, leaving sessions waiting for manual continuation. The report includes repeated hook logs and notes background subagents terminate on the same error: https://github.com/anthropics/claude-code/issues/87972
2. Claude Code issue #84346, opened 2026-08-06, analyzes 14 subagent transcripts; 13 failures cluster at ~600.0–605.6 seconds after the last tool result and are recorded as `[Request interrupted by user for tool use]` despite no human interruption. This supports a watchdog/model-stall event being routed through a user-interrupt terminal label: https://github.com/anthropics/claude-code/issues/84346
3. Claude Code issue #83266 documents a related liveness failure where a Stop-hook-driven goal is skipped while background work is live and is not re-evaluated after the background task finishes, leaving the session idle indefinitely. Its evidence is transcript-based and explicitly distinguishes observation from mechanism inference: https://github.com/anthropics/claude-code/issues/83266
4. Claude Code issue #35620 documents that `StopFailure` exists for API-error-terminated turns but was missing from hook documentation, showing recovery authors have historically had incomplete event-contract visibility: https://github.com/anthropics/claude-code/issues/35620

### Interpretation
The common engineering problem is not merely “streams fail.” It is terminal-event contract integrity: causal failure, actor attribution, hook dispatch and retry/resume authority are split across multiple runtime paths. When those paths disagree, agents can falsely infer human intent, stop unattended work, leak cleanup responsibility, or enter manual-recovery states.

## Existing approaches
Provider/SDK retries, generic request timeouts, Stop/StopFailure hooks, parent-agent redispatch, watchdogs, manual “continue”, and transcript inspection after failure.

## Remaining limitations
- Transport retries may be disabled after partial output to avoid duplicate side effects.
- A failure hook can observe an event without having authority to resume it.
- Generic user-interrupt labels erase machine-failure provenance.
- Parent agents often see only a flattened terminal message rather than cause/actor/retryability.
- Independent hook paths can skip or fire at different lifecycle states.
- Manual continuation does not scale to unattended runs.

## Root-cause analysis
1. Model streaming, watchdogs, cancellation, hook dispatch and parent/subagent lifecycle are separate asynchronous state machines.
2. Terminal labels are often derived from control-flow exit paths rather than a normalized causal event.
3. User cancellation and internal cancellation tokens can share mechanisms without preserving actor provenance.
4. Hook dispatch may occur after the runtime has already committed an irreversible terminal state.
5. Partial output/tool calls make blind retry unsafe, encouraging “no retry” without an explicit resumable-state contract.
6. Recovery loops lack a single trace that proves which transitions occurred.

## Improvement opportunity
Introduce a normalized terminal event ledger and deterministic validator. Require explicit `cause`, `actor`, `retryable`, classification, recovery-hook events, retry count and one final outcome. Treat absent causal evidence as unknown rather than user action. Validate recovery in canary traces before rollout.

## Goal
Make failure diagnosis and recovery decisions evidence-based, auditable and bounded without exposing hidden model reasoning.

## Metrics
False-user-cancel events, causal-classification coverage, recovery-hook dispatch coverage, retry-budget violations, duplicate terminal outcomes, successful recovery rate and time-to-terminal after fault.

## Trigger
Changes to stream handling, watchdogs, cancellation, hooks, subagent lifecycle, provider adapters or retry/resume logic; also incidents involving unexplained interruption/idle termination.

## Inputs
Normalized trace JSON, max retry policy and optional known expected cause for canaries.

## Outputs
Violations, summary metrics and deterministic exit status.

## Verification
Canary fixtures must prove: provider/stream failure is not classified as human cancel; true user cancel prevents auto-recovery; recoverable failures traverse configured hook/retry path; exactly one terminal final event exists; retry count never exceeds policy.
