# Research — Subagent Interruption Partial-Progress Contract

## Topic
Subagent Interruption Partial-Progress Contract

## Category
Thinking

## Problem
When a subagent is interrupted, rejected, timed out, rate-limited, or killed mid-run, the parent can receive an opaque terminal string that omits what the child already did. The parent may then infer “nothing ran,” deny side effects that actually occurred, redo completed work, or continue from a false state. This is a reasoning/recovery failure caused by missing observable handoff evidence, not by hidden chain-of-thought.

## Why it matters now
Recent August 2026 Claude Code reports show multiple independent interruption paths losing or misclassifying child state. Issue #84621 describes subagents that ran for minutes and performed tool calls before user interruption, yet the parent received only a generic interruption envelope and could not tell what happened. Issue #83412 reports subagents dying on spend/usage limits without partial-result handoff. Issue #84346 reports a ~600-second model-stall watchdog surfacing as “[Request interrupted by user for tool use]” despite no human interruption. Together these show a recurring orchestration weakness: terminal labels do not reliably carry cause, partial progress, last action, or evidence pointer.

## Affected users
Multi-agent coding/research users, orchestration-framework developers, headless agent operators, CI reviewers, platform teams, and users who must audit whether interrupted agents changed files or invoked external tools.

## Current public evidence
### Observed evidence
1. Claude Code issue #84621, opened August 6, 2026: interrupted foreground subagents returned only a generic interruption string despite 4.5–19+ minutes of work and tool activity. The reporter notes the parent could not distinguish “never ran” from “ran and stopped mid-action.” https://github.com/anthropics/claude-code/issues/84621
2. Claude Code issue #83412, opened August 2, 2026: subagents hitting spend/usage limits terminate without graceful partial output or state handoff, making recovery and cause classification difficult. https://github.com/anthropics/claude-code/issues/83412
3. Claude Code issue #84346, opened August 6, 2026: 13 subagent transcripts showed a tight ~600–605 second gap before a generic “interrupted by user” message even when the user did not interrupt, strongly suggesting a watchdog path mislabeled as human cancellation. https://github.com/anthropics/claude-code/issues/84346
4. Claude Code issue #85066, opened August 8, 2026, reports headless sessions exiting success after background subagent dispatch while expected review work never completed, demonstrating why parent completion cannot rely solely on a superficial terminal success state. https://github.com/anthropics/claude-code/issues/85066

## Existing approaches
- Return a single terminal status or error string.
- Persist detailed child transcripts separately.
- Retry the entire child task.
- Let the parent inspect workspace state manually after an interruption.
- Treat user cancellation, permission rejection, timeout, and quota failure as one generic interruption class.

## Remaining limitations
Raw transcripts may exist but are not surfaced in the parent envelope. A retry can duplicate side effects or overwrite partial work. Workspace inspection cannot reconstruct non-file actions such as network requests, issued approvals, external comments, or commands. Generic terminal labels erase causal information and can produce false parent conclusions. A human operator should not need to reverse-engineer internal logs to answer “what happened before it stopped?”

## Root-cause analysis
- Terminal state is modeled as a status string rather than a structured recovery contract.
- Interruption cause and user provenance are conflated.
- Child progress is not checkpointed into a compact parent-readable ledger.
- Side effects, tool calls, and last durable milestone are not summarized at termination.
- Parent logic assumes absence of final output means absence of work.
- Retry decisions are made without an idempotency/recovery assessment.

## Improvement opportunity
Require every non-clean child termination to emit a structured partial-progress envelope: causal class, whether a human actually initiated it, start/end times, tool-call count, last attempted action, durable checkpoints, known side effects, changed resources, incomplete step, evidence/transcript pointer, and recovery recommendation. The parent must treat unknown evidence as unknown—not “did not happen.”

## Goal
Make interrupted multi-agent work recoverable and truthfully reportable without exposing hidden reasoning.

## Metrics
- 100% non-clean child terminations produce a parseable envelope.
- 100% envelopes include causal class and `human_initiated` tri-state/boolean where known.
- 100% known side effects are enumerated or linked to auditable evidence.
- 0 parent claims of “nothing happened” when the child ledger records tool activity.
- Reduced duplicate work/tool calls after recovery.
- Recovery decision coverage: resume, verify-first, safe-retry, or escalate.

## Trigger
Child interruption, cancellation, permission rejection, watchdog timeout, quota/spend exhaustion, model/API failure, process kill, or headless parent shutdown with outstanding child work.

## Inputs
Child ID, timestamps, termination event, tool events, durable checkpoints, side-effect records, changed-resource identifiers, evidence pointer, and parent task contract.

## Outputs
Validated partial-progress envelope, parent recovery decision, verification obligations, and stop/escalation state.

## Interpretation
These issue reports are specific product observations. The reusable engineering problem is broader: multi-agent systems need loss-aware terminal handoff so a parent can distinguish no-start, partial execution, clean completion, and uncertain state.

## Proposed solution
A machine-checkable partial-progress envelope and bounded recovery workflow. Deterministic validation rejects opaque terminal states; parent policy requires verification before retry when side effects or unknown state are present. No hidden chain-of-thought is requested or stored.