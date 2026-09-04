# Research: Agent Fixed Context Overhead Regression Sentinel

## Topic
Detecting fixed context/token overhead regressions in AI agent harnesses before they consume usable context, quota, cost, and latency.

## Category
Token

## Problem
AI coding and agent runtimes can consume large token budgets before meaningful user/task context is added. System prompts, tool schemas, skills, MCP definitions, subagent descriptions, memory, and harness scaffolding may create a fixed baseline that changes after releases, model/context-tier migration, or configuration growth. Without a fresh-session baseline and component attribution, teams often notice the regression only after quota depletion, compaction, latency, or outright prompt-too-long failures.

## Why it matters now
Recent 2026 reports show fixed overhead large enough to increase fresh-session cost materially, multiply with subagent fan-out, and even exceed an agent's entire context window before useful input is processed.

## Affected users
- developers using coding agents with large tool/skill/MCP sets
- platform teams operating agent harnesses or multi-agent orchestration
- teams evaluating model/context-window migrations
- organizations tracking token cost, quota, latency, and context utilization

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84947, opened 2026-08-07, reports a built-in `claude-code-guide` subagent whose fixed system/tool/attachment overhead was measured at roughly 214k tokens, exceeding a 200k context limit before meaningful user input. Source: https://github.com/anthropics/claude-code/issues/84947
2. OpenAI Codex issue #39808, opened 2026-08-20, reports that subagent fan-out can increase usage because each child pays fixed context/tool/skill overhead even when smaller models are used. Source: https://github.com/openai/codex/issues/39808
3. OpenAI Codex issue #29783, opened 2026-06-24, requests a detailed context usage breakdown by system prompt, tool definitions, rules, skills, MCP, subagent definitions, and conversation because a high-level percentage does not reveal what consumes the window. Source: https://github.com/openai/codex/issues/29783
4. Anthropic Claude Code issue #68988, opened 2026-06-17, reports fresh-session overhead rising from about 29k to about 50k tokens with no user/project configuration change, coincident with a 1M-context migration. Source: https://github.com/anthropics/claude-code/issues/68988
5. OpenCode issue #26661, opened 2026-05-10, reports about 68k tokens before the first user message in a setup with many skills and tools, attributing most overhead to skill descriptions, tool schemas, agent instructions, and injected skills. Source: https://github.com/anomalyco/opencode/issues/26661

## Existing approaches
Teams currently reduce skills/tools, disable unused MCP servers, shorten instruction files, start fresh sessions, inspect provider usage counters, or compare harnesses manually. Some runtimes expose a coarse context percentage, and community tooling provides token-optimization guidance.

## Remaining limitations
- Most measurements are taken after a user notices excessive usage rather than as a release gate.
- High-level context percentages lack component attribution.
- Fixed overhead can vary by model, context tier, harness version, enabled tools/skills, and subagent type.
- A larger context window can hide a fixed-overhead regression while still increasing cost and reducing effective capacity.
- Multi-agent fan-out multiplies per-agent fixed overhead.
- Manual optimization risks deleting context required for correctness if changes are not regression-tested.

## Root-cause analysis
### Interpretation
The recurring engineering gap is not simply “prompts are too long.” It is absent baseline governance for non-task context. Harness components are assembled dynamically, but their token contribution is rarely treated like a measurable build artifact with a budget. Releases or configuration changes can therefore increase the fixed baseline without an explicit performance/token regression signal. Because provider accounting and UI indicators often aggregate categories, the source is difficult to localize.

## Improvement opportunity
### Proposed solution
Create a deterministic regression sentinel that accepts fresh-session measurements with component-level token counts, computes total fixed overhead and percentage of context consumed, compares a candidate against an approved baseline, and blocks rollout when absolute or relative thresholds are exceeded. Optimization must preserve required safety, permissions, tools, and task-critical context; reductions require quality regression verification.

## Goal
Make fixed context overhead observable, attributable, budgeted, and release-gated before production users encounter quota, latency, compaction, or fit failures.

## Metrics
- fixed tokens per fresh session/agent
- fixed overhead as percentage of context window
- delta vs approved baseline
- per-component token contribution
- fan-out multiplied fixed cost estimate
- cost/task and latency/task where provider data is available
- quality/regression pass rate after any reduction

## Trigger
Use on harness/model/tool/skill/MCP/subagent changes, model-context-tier migration, unexpected quota burn, prompt-too-long failures, or before scaling multi-agent fan-out.

## Inputs
Baseline JSON, candidate JSON with total/context limit/component counts, policy thresholds, and optional fan-out count/cost metadata.

## Outputs
Pass/block decision, deltas, dominant contributors, budget violations, and a verification record.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84947
- https://github.com/openai/codex/issues/39808
- https://github.com/openai/codex/issues/29783
- https://github.com/anthropics/claude-code/issues/68988
- https://github.com/anomalyco/opencode/issues/26661

## Evidence status
Observed reports are kept separate from this package's proposed controls. The package does not claim a token reduction until a deployment measures before/after usage and quality remains at or above its acceptance threshold.