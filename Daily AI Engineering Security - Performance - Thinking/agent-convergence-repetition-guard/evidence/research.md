# Research — Agent Convergence Repetition Guard

**Topic:** Observable convergence control for long-running tool agents  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running agents can keep executing while failing to converge: identical tool calls repeat, exploration restarts, or the plan expands into more tasks/reviews than it closes. A fixed step cap limits damage but cannot distinguish productive long runs from stuck loops.

## Why it matters now
Recent 2026 reports from multiple agent ecosystems describe large token waste, multi-day task expansion, and retry loops that reset useful work. At the same time, framework documentation is evolving toward progress-keyed and budgeted recovery rather than wall-clock-only control.

## Affected users
Coding-agent users, agent-platform teams, workflow/orchestration builders, and engineering teams operating expensive long-running autonomous tasks.

## Current public evidence

### Observed evidence
1. Vercel AI SDK issue #17606, opened July 21, 2026, requests a built-in repeated-identical-tool-call stop condition because fixed step caps are too blunt and uncapped loops can spend the full budget while stuck: https://github.com/vercel/ai/issues/17606
2. OpenAI Codex issue #35892, opened July 29, 2026, reports a long-running coding task repeatedly expanding a finite implementation into additional tasks, subagent lanes, review cycles, and verification gates over roughly three days instead of converging: https://github.com/openai/codex/issues/35892
3. Claude Code issue #85206, opened August 9, 2026, reports a watchdog repeatedly killing an actively working subagent, restarting from scratch, and burning roughly 580k tokens with zero progress: https://github.com/anthropics/claude-code/issues/85206
4. Claude Code issue #86085, opened August 12, 2026, reports subagent lifecycle handling that can mark completion while long-running monitor children remain live, dropping terminal events and wasting tokens: https://github.com/anthropics/claude-code/issues/86085
5. AI SDK loop-control documentation provides `stopWhen`, defaults to `stepCountIs(20)`, and supports custom conditions, confirming stop control is an explicit framework responsibility: https://ai-sdk.dev/docs/agents/loop-control
6. Cloudflare Agents documentation updated August 20, 2026 uses progress-keyed no-progress timeouts and a maximum recovery-work budget, separating “stuck” from “still progressing but runaway”: https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/

### Interpretation
The recurring engineering problem is insufficiently specific progress semantics. Step count, elapsed time, or retry count alone do not represent convergence. Useful stopping requires observable task-level signals: whether tool/action signatures repeat, whether acceptance items close, whether state changes, and whether scope grows without corresponding completion.

## Existing approaches
- Fixed step limits (`stepCountIs`).
- Wall-clock timeout/watchdog.
- Cost/token budgets.
- Generic no-progress timeouts.
- Custom stop conditions.
- Human interruption/cancellation.
- Retry after transient failure.

## Remaining limitations
- Fixed caps can kill legitimate long tasks early.
- Long limits let a repeated-call loop burn the whole allowance.
- Wall-clock watchdogs can mistake slow but productive work for stalls.
- Retries may replay the same action or restart expensive discovery from zero.
- “Progress” is often represented by output activity rather than changed task state.
- Scope expansion can appear productive while completion rate trends toward zero.

## Root-cause analysis
1. Task acceptance criteria are not represented as observable state.
2. Tool calls are not normalized/fingerprinted for repetition detection.
3. Retries lack a requirement to change hypothesis, input, or action.
4. Completion and background-child lifecycle signals are weakly coordinated.
5. Budgets measure total work but not progress per unit work.

## Improvement opportunity
Add a convergence gate that operates on observable metadata only. Normalize tool name + arguments into a signature; track progress keys, completed/open item counts, and repeated no-progress actions; warn before stop; require a changed hypothesis/action after warning; and cap recovery cycles. Productive long traces continue as long as measurable task state changes.

## Relevant sources
- Vercel AI SDK #17606: https://github.com/vercel/ai/issues/17606
- OpenAI Codex #35892: https://github.com/openai/codex/issues/35892
- Claude Code #85206: https://github.com/anthropics/claude-code/issues/85206
- Claude Code #86085: https://github.com/anthropics/claude-code/issues/86085
- AI SDK loop control: https://ai-sdk.dev/docs/agents/loop-control
- Cloudflare chat recovery: https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/