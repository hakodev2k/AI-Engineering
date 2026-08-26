# Research — Tool Loop Progress Circuit Breaker

**Topic:** deterministic detection and recovery for repeated no-progress tool calls  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
AI agents can continue issuing the same or effectively equivalent tool calls after a successful or failed result, sometimes dozens of times. This is a planning/verification failure that should be observable from runtime evidence rather than hidden reasoning.

## Why it matters now
Recent 2026 reports show the same failure across several independent agent stacks, including loops after successful calls, loops after repeated failures, subagent-specific gaps, and runtime-level replay bugs that prompt instructions cannot fix.

## Affected users
Developers using coding agents, operators of multi-agent systems, platform engineers, and teams exposing mutating tools to autonomous loops.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #89069, opened August 18, 2026, reports identical successful terminal commands repeating 3–20+ times until timeout or interruption: https://github.com/NousResearch/hermes-agent/issues/89069
2. Vercel AI issue #17606, opened July 21, 2026, requests a repeated-tool-call stop condition because step caps either terminate productive work too early or let stuck loops burn the full budget: https://github.com/vercel/ai/issues/17606
3. Google ADK Python issue #6566, opened August 3, 2026, reports an infinite tool-call loop in streaming multi-agent transfer flows: https://github.com/google/adk-python/issues/6566
4. Qwen Code issue #6505 reports subagents repeating identical calls without the main loop-detection service: https://github.com/QwenLM/qwen-code/issues/6505
5. PicoClaw issue #3311, opened August 2, 2026, reports repeated identical tool failures continuing toward `max_tool_iterations` while the user receives no answer: https://github.com/sipeed/picoclaw/issues/3311
6. Claude Code issue #59318 reports exploratory tasks repeating identical Bash calls 30–50+ times, wasting context and compute: https://github.com/anthropics/claude-code/issues/59318
7. OpenAI Codex issue #38132, opened August 12, 2026, reports a coordinator entering a tool-selection loop while checking subagent status: https://github.com/openai/codex/issues/38132

### Interpretation
The common defect is not simply "the model reasoned badly." Runtimes often lack a durable, cross-step notion of progress. Exact-call fingerprints alone miss varying-argument/fixed-result loops; failure-only counters miss repeated successful but useless calls; model-authored anti-loop text cannot prevent runtime replay.

## Existing approaches
- Fixed maximum step/tool-iteration caps.
- Exact repeated-call detection.
- Warning messages injected back to the model.
- Failure counters.
- Human cancellation.
- Prompt rules instructing the model not to repeat itself.

## Remaining limitations
- Global caps do not distinguish productive long runs from stuck runs.
- Warning-only guards may be ignored.
- Exact signatures miss semantically equivalent calls.
- Success status does not prove progress.
- Runtime replay can occur independently of the model's current intent.
- Hard stops can leave the user without a structured recovery path.

## Root-cause analysis
1. Tool success/failure is confused with task progress.
2. Call and outcome evidence is not normalized into a persistent ledger.
3. Guardrails are often scoped to the main agent and omitted from subagents.
4. Mutating and read-only tools use the same repetition threshold.
5. Recovery is delegated back to the same loop without requiring changed evidence or plan.

## Improvement opportunity
Add a runtime circuit breaker based on normalized call fingerprints, normalized outcome fingerprints, explicit progress evidence, and tool consequence class. Require a changed hypothesis or changed action after a bounded no-progress streak, and fail closed earlier for mutating calls.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/89069
- https://github.com/vercel/ai/issues/17606
- https://github.com/google/adk-python/issues/6566
- https://github.com/QwenLM/qwen-code/issues/6505
- https://github.com/sipeed/picoclaw/issues/3311
- https://github.com/anthropics/claude-code/issues/59318
- https://github.com/openai/codex/issues/38132
