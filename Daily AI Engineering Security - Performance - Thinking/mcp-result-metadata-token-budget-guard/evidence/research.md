# Research

## Topic
Repeated MCP result metadata consumes agent context without proportional reasoning value

## Category
Token

## Problem
Tool-heavy MCP sessions may admit transport/display metadata into model context on every call. Fixed metadata is then paid repeatedly in context occupancy even when unchanged.

## Why it matters now
MCP 2026-07-28 moved server identity into result `_meta` and the TypeScript SDK stamps `_meta['io.modelcontextprotocol/serverInfo']` on every 2026-era response. A GitHub Actions MCP structural analysis published 2026-08-11 measured an approximately 590-token base64 icon block in `_meta.serverInfo.icons` on every sampled GitHub MCP tool call, independent of payload.

## Affected users
Agent-runtime developers, MCP client maintainers, teams with high tool-call volumes, users operating large-context or cost-sensitive coding/research agents.

## Current public evidence
### Observed evidence
- GitHub `gh-aw` Discussion #52025 (2026-08-11) reports every analyzed GitHub MCP tool call carrying a fixed ~590-token base64 icon block in `_meta.serverInfo.icons`; tools with payload field filters were otherwise materially leaner. https://github.com/github/gh-aw/discussions/52025
- MCP TypeScript SDK migration documentation for 2026-07-28 states that every 2026-era server response is stamped with `_meta['io.modelcontextprotocol/serverInfo']`. https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
- MCP schema permits icons with URI sources, including data URIs, which can make identity metadata substantially larger than a name/version pair. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts

## Existing approaches
Clients usually pass tool results to the model after generic truncation/serialization. Some tools support `fields`/`perPage` payload filtering. Prompt caching targets repeated prompt prefixes, not necessarily changing tool-result suffixes.

## Remaining limitations
Generic truncation cannot distinguish semantic payload from protocol/display metadata. Payload filters do not remove fixed response metadata. Repeated metadata may differ in serialization order or wrapper shape, defeating naive exact-string deduplication. Removing `_meta` wholesale can break correctness if a field is used for correlation, identity, cache or security decisions.

## Root-cause analysis
1. Transport/UI metadata and model-reasoning payload are serialized together.
2. Context-admission layers often lack field-level budgets and semantic allowlists.
3. Modern protocol identity stamping makes repetition systematic.
4. Data-URI icons magnify a display concern into a token concern.
5. Teams measure tool payload size but not metadata attribution.

## Improvement opportunity
Add a measurement-first context-admission layer that profiles `_meta`, detects stable repeated fields, preserves originals out-of-band, and removes only fields proven unnecessary for the model.

## Goal
Reduce repeated result-metadata tokens without losing task-relevant content or protocol/security state.

## Metrics
`meta_tokens_per_call`, `repeated_server_info_tokens`, `meta_ratio`, `tokens_per_task`, `cost_per_task`, `latency_per_task`, `quality_regression_rate`.

## Trigger
Tool-call traces show high result-token usage, MCP 2026 migration, serverInfo/icon changes, or context-pressure incidents.

## Inputs
Raw MCP result capture in JSONL and an explicit context-admission allow/deny policy.

## Outputs
Attribution report, candidate removable paths, before/after budget, verification evidence.

## Interpretation
The protocol behavior is not itself a bug. The engineering gap is allowing transport/display metadata to flow unexamined into the model's limited context.

## Proposed solution
Profile first, then filter only the model-context projection while retaining the canonical response for all non-model consumers.