# Research — Browser Observation Context Budget Guard

## Topic
Bound and deduplicate browser observations before DOM snapshots, screenshots, and browser-tool outputs consume the agent context budget.

## Category
Token

## Problem
Browser agents can spend more context and usage on observations than on decisions. Repeated DOM snapshots, screenshots, locator dumps, page metadata, and replayed browser outputs accumulate across sequential steps, causing early compaction, quota drain, high latency, navigation loops, or incomplete workflows.

## Why it matters now
Fresh 2026 reports show this in current coding-agent browser workflows rather than only synthetic benchmarks.

## Affected users
Developers using browser-enabled coding agents, web-debugging agents, Playwright/MCP clients, authenticated browser automation, and platform teams operating long-running browser workflows.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #39066, opened 2026-08-17, reports Chrome/browser tasks on Windows with GPT-5.6 Sol as extremely laggy and token-heavy, explicitly asking for diagnostics separating model reasoning, browser calls, screenshots/page state, retries, and compaction. https://github.com/openai/codex/issues/39066
2. OpenAI Codex issue #32303, opened 2026-07-09, reports browser workflows repeatedly exhausting context/usage before completion, followed by back-and-forth navigation and inability to finish long debugging sessions. https://github.com/openai/codex/issues/32303
3. OpenAI Codex issue #30665, opened 2026-06-30, documents a short browser-extension workflow with ~21 tool calls plus DOM snapshots/screenshots and unexpectedly high usage, requesting per-tool/context contribution diagnostics. https://github.com/openai/codex/issues/30665
4. A 2026-08-12 engineering analysis of Playwright MCP reports that accessibility snapshots can contribute thousands to tens of thousands of tokens per action and argues that repeated full observations compound context consumption. https://lite.ego.app/article/playwright-mcp-token-problem

## Existing approaches
Context compaction, general token limits, browser tool APIs, manual selector targeting, prompt instructions to be concise, screenshot compression, and generic tool-output truncation.

## Remaining limitations
Compaction reacts after cost is incurred. Global truncation can remove task-critical state. Prompt advice is not deterministic. Browser tools often emit a full observation after each action even when most of the page is unchanged. Token accounting frequently lacks per-observation attribution, so teams cannot prove which observation type caused the growth.

## Root-cause analysis
1. Full-page observations are treated as default rather than an expensive resource.
2. Stable page structure is resent after small state changes.
3. Observation selection is not tied to the next decision's information need.
4. Screenshots and DOM snapshots may coexist even when one modality is sufficient.
5. Hosts lack per-call byte/token estimates and duplicate-content fingerprints.
6. Long workflows retain stale observations after the relevant decision is complete.

## Improvement opportunity
Introduce a pre-admission browser observation budget: estimate payload size, fingerprint observations, prefer targeted/delta observations, block duplicate full snapshots, limit simultaneous modalities, and record before/after context attribution. Preserve correctness by allowing explicit budget escalation when the next decision genuinely requires a full view.

## Proposed solution
This package provides a JSONL observation profiler, deterministic budget rules, an analyzer skill, a bounded optimize-and-verify workflow, a pre-context hook, and regression tests for duplicate and over-budget browser outputs.

## Trigger
Before browser DOM/screenshot/tool output is appended to model-visible context and during diagnosis of browser-heavy sessions.

## Inputs
Observation events with type, content or byte count, page identity, task step, and whether a full observation is required.

## Outputs
Per-event estimated bytes/tokens, duplicate status, admission recommendation, and aggregate budget metrics.

## Metrics
Observation tokens/task; browser-output share of input context; duplicate observation ratio; full-snapshot count; context utilization; compaction count; latency/task; task completion/quality regression rate.

## Verification
A valid deployment must reduce admitted browser observation volume on duplicate-heavy fixtures without suppressing explicitly required full observations, and it must report before/after metrics rather than claim improvement subjectively.
