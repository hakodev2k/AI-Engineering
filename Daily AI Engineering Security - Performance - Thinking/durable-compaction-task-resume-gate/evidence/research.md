# Research

## Topic
Durable Compaction Task Resume Gate

## Category
Thinking

## Problem
Context compaction can sever execution continuity even when it successfully reduces token usage: the agent loses or ignores the currently active task and may stop, re-plan, or report success without completing the requested work.

## Why it matters now
Two fresh September 2026 reports show the same class across different agent runtimes. The failure is especially severe for scheduled/non-interactive tasks because there may be no subsequent user message to restate the goal.

## Affected users
Coding-agent users, autonomous/scheduled agent operators, platform builders, multi-agent teams, and developers relying on long-running task continuity.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #42693, opened 2026-09-04, reports that with experimental context management the agent often stops after automatic compaction and asks what to do next even though the current objective is unfinished and it had been progressing autonomously.
2. NousResearch Hermes Agent issue #100818, opened 2026-09-02, reports scheduled runs where `ContextCompressor` compacts the only job prompt into a summary whose handoff text tells the model not to fulfill requests in the summary and to respond only to a later user message. In cron execution there is no later message, so the run can report success while delivering nothing.
3. GitHub Copilot CLI issue #3157 (2026-05-06) documents a related post-compaction failure mode: plan -> compact -> re-plan repeating instead of returning to execution.
4. Claude Code issue #29263 reports background-agent IDs lost on compaction, showing that execution handles as well as natural-language intent can be lost across the boundary.

### Interpretation
Compaction is not only a token operation; it is a state-transition boundary. Natural-language summaries are insufficient as the sole carrier of task lifecycle state. A robust runtime needs a durable execution checkpoint whose correctness can be validated independently of the model-generated summary.

### Proposed solution
Persist and validate a structured active-goal checkpoint outside compactable history. Gate post-compaction continuation on checkpoint completeness and observable completion criteria. For autonomous runs, absence of a new user message must not imply completion or permission to stop.

## Existing approaches
Automatic summaries; compaction handoff prompts; task/todo lists; background-task registries; context-management prompts; transcript persistence; manual user re-prompts.

## Remaining limitations
Summaries can omit active intent, confuse historical and pending work, discard external handles, or contain interactive-only continuation instructions. Task lists often lack acceptance criteria and evidence. Runtime success may be based on process termination rather than goal completion.

## Root-cause analysis
- Active goal is stored only in compactable conversational text.
- Lifecycle state and historical summary are conflated.
- Resume logic assumes a later user turn exists.
- Completion is not gated on explicit observable acceptance criteria.
- External task/agent identifiers are not durably linked to the checkpoint.
- No deterministic post-compaction continuity assertion runs before execution continues or terminates.

## Improvement opportunity
Treat compaction like process checkpoint/restore: save minimal durable state before mutation, validate it afterward, resume against explicit pending work, and block false terminal success.

## Relevant sources
- https://github.com/openai/codex/issues/42693
- https://github.com/NousResearch/hermes-agent/issues/100818
- https://github.com/github/copilot-cli/issues/3157
- https://github.com/anthropics/claude-code/issues/29263
