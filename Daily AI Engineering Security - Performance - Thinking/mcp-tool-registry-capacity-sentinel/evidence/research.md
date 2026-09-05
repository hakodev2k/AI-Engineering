# Research

## Topic
MCP Tool Registry Capacity Sentinel

## Category
Thinking

## Problem
Agents and automations can reason from a false capability model when MCP connectors are healthy but only part of their tool inventory is registered or visible.

## Why it matters now
Large MCP aggregators increasingly expose hundreds of tools, while agent products impose capacity limits for context/performance reasons. Current reports show that some surfaces fail by silently truncating rather than exposing an explicit capacity state, which turns a platform constraint into an agent reliability problem.

## Affected users
Developers using many MCP servers, enterprise connector gateways, scheduled agents, platform builders, and teams whose workflows depend on specific tools being available throughout a run.

## Current public evidence
### Observed evidence
1. `anthropics/claude-code#77704`, opened 2026-07-15, reports custom remote connectors settling at exactly 256 aggregate tools or losing an entire connector, with “Refresh Tools” restoring them only temporarily. The report says the behavior appears across web/desktop and org/personal accounts and breaks automations mid-run.
2. `anthropics/claude-ai-mcp#587`, opened 2026-07-09, independently reports Cowork registering exactly 256 of ~630 tools from one healthy remote MCP endpoint, with no warning, while Claude Code can load the full set using deferred loading.
3. `google-gemini/gemini-cli#21823`, opened 2026-03-10, asks to raise an MCP tool limit from ~100 to 500 and explicitly describes silently dropped tools when multiple servers exceed the budget.
4. Microsoft Azure SRE Agent documentation published in 2026 documents an explicit 80-tool combined capacity and surfaces a progress indicator. This is evidence of the legitimate engineering reason for limits and an example of a more observable capacity design.
5. `anthropics/claude-code#60428` reports a different failure mode in which Slack MCP tools disappear mid-session while `claude mcp list` still reports Connected, illustrating that transport health and registry capability are distinct states.

### Interpretation
A tool-count limit is not inherently a bug; large tool catalogs have token, selection, latency, and quality costs. The reliability defect is silent capability drift. Agents need an observable contract stating which task-required tools are actually available at execution time.

### Proposed solution
Measure and compare three inventories: server-advertised, client-visible, and task-required. Fail before planning when required-tool coverage is incomplete. Record fingerprints over time to detect registry drift and use bounded recovery rather than repeated blind refreshes.

## Existing approaches
Hard tool limits; deferred tool loading/tool search; connector health checks; manual refresh; per-tool enable/disable; platform-specific capacity indicators; reducing the number of enabled connectors; MCP aggregators/gateways.

## Remaining limitations
Hard caps may be undocumented or surface-dependent. Deferred loading can itself regress. Connector health usually verifies transport/authentication, not model-visible registration. Manual refresh is transient. Simply increasing the cap can worsen prompt/token and tool-selection quality.

## Root-cause analysis
- Transport health is conflated with capability health.
- Tool registry capacity is not represented as an explicit contract.
- Clients may truncate/filter without emitting machine-readable diagnostics.
- Task planners do not verify required capabilities before decomposition.
- Recovery uses repeated refresh instead of bounded diagnosis.

## Improvement opportunity
Add a pre-task capability sentinel that calculates retention and required coverage, reports missing tool names deterministically, tracks registry fingerprint drift, and blocks planning when the capability set is incomplete. Pair it with explicit tool selection/deferred loading rather than unbounded cap increases.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/77704
- https://github.com/anthropics/claude-ai-mcp/issues/587
- https://github.com/google-gemini/gemini-cli/issues/21823
- https://github.com/anthropics/claude-code/issues/60428
- https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sre-agent/mcp-connectors.md
