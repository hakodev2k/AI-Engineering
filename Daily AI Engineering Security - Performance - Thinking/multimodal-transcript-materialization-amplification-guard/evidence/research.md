# Research

## Topic
Multimodal transcript materialization amplification

## Category
Performance

## Problem
AI coding runtimes can store screenshots/generated images inline in durable transcripts and repeatedly materialize those bytes during resume, render, compaction, child-agent fork, logging, or request assembly. Disk and RAM usage can grow far beyond the semantic context actually needed.

## Why it matters now
Fresh 2026 reports show this class causing process crashes, kernel OOM events, multi-gigabyte session stores, and unusable workflows across OpenAI Codex and Anthropic Claude Code.

## Affected users
Developers using screenshots, computer-use/browser tools, image generation, resumable workers, long-running sessions, and multi-agent forks; platform teams running concurrent agent workers.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #38753, opened 2026-08-15: one image-heavy workflow produced about 9.36 GB of rollout JSONL plus retained generated images, correlated with OOM/resource failures. https://github.com/openai/codex/issues/38753
2. OpenAI Codex issue #39469, published 2026-08-19: multi-agent fan-out duplicated full parent context into 22 rollout files totaling about 208 GiB and a 14 GB working set. https://github.com/openai/codex/issues/39469
3. Anthropic Claude Code issue #79196, July 2026: headless `--resume/--fork-session` reified large transcripts at roughly 9-14x file size in measured synthetic tests and OOM-killed a 16 GB production host. https://github.com/anthropics/claude-code/issues/79196
4. Anthropic Claude Code issue #80175, July 2026: image results were stored as duplicate base64 in one transcript line and repeatedly measured by the rendering path, producing hard freezes and 100% CPU. https://github.com/anthropics/claude-code/issues/80175
5. Anthropic Claude Code issue #86421, August 2026: tool-captured screenshots dominated transcript bytes and were repeatedly re-sent on later turns. https://github.com/anthropics/claude-code/issues/86421

### Interpretation
This is not only a token problem. One logical binary artifact can exist as inline base64, duplicate transcript fields, parsed objects, request payloads, rendered strings, logs, child snapshots, and generated-image files. Materialization cost therefore scales differently from semantic context size.

## Existing approaches
Context compaction, API image limits, transcript JSONL, generated-image caches, session resume/fork, and manual archive/delete/cleanup.

## Remaining limitations
Token compaction does not guarantee disk/RAM bounds; base64 adds size before duplication; whole-file parsing can hold multiple copies; child fan-out can inherit large parent state; render/log paths may repeatedly touch multi-megabyte strings; archiving may not reclaim all artifacts.

## Root-cause analysis
1. Binary artifacts are embedded directly in conversational state.
2. The same artifact may be stored in multiple fields.
3. Resume/fork may parse whole history rather than stream the needed tail.
4. Compaction/fan-out may copy images rather than stable references.
5. Resource budgets are checked after expensive materialization.
6. Storage lifecycle and semantic conversation lifecycle are coupled.

## Improvement opportunity
Profile transcript composition before expensive operations, estimate worst-case materialization, enforce budgets, and move runtimes toward reference-based/content-addressed binary storage and streaming context assembly.

## Goal
Bound RAM, disk, CPU, and resume latency as multimodal history grows.

## Metrics
Transcript bytes, decoded-binary estimate, duplicate ratio, largest JSONL record, projected materialization, peak RSS, resume/fork latency, fan-out amplification, failures.

## Trigger
Before resume, fork, compaction, rendering, or spawning agents from a large multimodal parent.

## Inputs
Transcript JSONL plus budget config.

## Outputs
Profile JSON, PASS/BLOCK exit status, and before/after evidence.

## Relevant sources
- https://github.com/openai/codex/issues/38753
- https://github.com/openai/codex/issues/39469
- https://github.com/anthropics/claude-code/issues/79196
- https://github.com/anthropics/claude-code/issues/80175
- https://github.com/anthropics/claude-code/issues/86421

## Proposed solution
This package provides a read-only profiler and deterministic pre-resume/fan-out budget gate. It does not claim improvement until before/after measurement proves it.