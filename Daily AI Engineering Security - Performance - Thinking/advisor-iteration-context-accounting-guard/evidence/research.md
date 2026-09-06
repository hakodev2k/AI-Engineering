# Research

## Topic
Advisor Iteration Context Accounting Guard

## Category
Token

## Problem
Agent runtimes can misinterpret cumulative per-request token accounting as current context occupancy. Anthropic's Advisor tool exposes multiple executor/advisor iterations in one request; top-level executor input fields are sums across executor iterations, not the size of the final executor prompt. If a compaction or admission controller treats those cumulative totals as live context size, an Advisor turn can make a half-full context look nearly full and trigger premature compaction, extra latency, token burn, and state loss.

## Why it matters now
Advisor is a current server-side agent primitive and its documentation explicitly distinguishes cumulative usage from per-iteration usage. Multiple open Claude Code reports in July-August 2026 provide transcript-level evidence that Advisor turns can double apparent context and trigger auto-compaction hundreds of thousands of tokens early, with subagents particularly affected.

## Affected users
Claude/Advisor API integrators, coding-agent runtime authors, subagent orchestrators, context-window managers, telemetry/cost platform builders, and developers operating long-context autonomous sessions.

## Current public evidence

### Observed evidence
1. Anthropic's current Advisor documentation says `usage.iterations[]` carries the per-iteration breakdown and that top-level executor fields sum across executor iterations. Because later executor iterations resend the growing conversation, summed input can exceed any single prompt; consumers should use the iterations array for detailed accounting.
2. Claude Code issue #81620, opened 2026-07-27, reports 27 Advisor turns across 20 transcripts with 27 apparent doublings; 7 of 16 auto-compactions occurred on Advisor turns while real context was roughly 82-100k tokens.
3. Claude Code issue #84738, opened 2026-08-07, reports top-level cache-read usage near 1.03M from two ~515k executor iterations and a subsequent compaction at apparent ~1.04M even though real executor context remained ~516k. An eight-day transcript scan reported many early compactions, especially in subagents.
4. Claude Code issue #53065 independently shows a ~513-515k real executor context producing top-level cache-read usage over 1.02M after an Advisor call.
5. Earlier Claude Code issue #34805 reports auto-compaction at ~41% actual usage in a tool-heavy 1M-context session, showing that token-estimation/occupancy confusion is a broader recurring failure class even outside the clearest Advisor reproduction.

### Interpretation
Three quantities must not be conflated: current prompt occupancy, cumulative tokens processed across iterations, and billable usage. They answer different questions. Compaction should be driven by the current executor prompt plus reserved output/safety margin, while cost tracking may legitimately sum all iterations.

### Proposed solution
Normalize provider usage into typed metrics and compute context occupancy from the last relevant executor/message iteration rather than cumulative top-level input totals when an iteration breakdown is available. Emit an inflation ratio, detect semantic mismatches, gate compaction decisions on occupancy-specific fields, and regression-test Advisor and non-Advisor examples.

## Existing approaches
- Provider top-level usage totals.
- `usage.iterations[]` for Advisor breakdown.
- Automatic context compaction near configured thresholds.
- External token counters and telemetry collectors.
- Prompt caching metrics (`cache_read_input_tokens`, `cache_creation_input_tokens`).

## Remaining limitations
- Top-level totals are valid for cumulative executor processing but unsafe as a direct occupancy proxy.
- Different provider/tool responses expose different accounting shapes.
- Cached-input fields make naive `input_tokens` comparisons misleading.
- Subagents can compact mid-task if they consult Advisor near a threshold.
- UI meters, cost dashboards, and compaction controllers may each use different interpretations of the same fields.
- A compatibility fallback is required when `iterations` is absent.

## Root-cause analysis
1. Telemetry fields lack explicit semantic typing at the consumer boundary.
2. Cumulative processing is mistaken for instantaneous context occupancy.
3. Compaction controllers ingest provider usage without normalization.
4. Tests cover token totals but not multi-iteration occupancy invariants.
5. Subagent and main-agent telemetry paths can diverge.

## Improvement opportunity
A small deterministic normalization layer can separate `occupancy_tokens`, `cumulative_executor_tokens`, and `advisor_tokens`, then make every compaction decision consume only the occupancy field. The layer is independently testable, provider-adapter friendly, and measurable through false-compaction rate, inflation ratio, tokens preserved before compaction, and regression rate.

## Relevant sources
- Anthropic Advisor tool documentation: https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
- Claude Code issue #81620, 2026-07-27: https://github.com/anthropics/claude-code/issues/81620
- Claude Code issue #84738, 2026-08-07: https://github.com/anthropics/claude-code/issues/84738
- Claude Code issue #53065: https://github.com/anthropics/claude-code/issues/53065
- Claude Code issue #34805, 2026-03-16: https://github.com/anthropics/claude-code/issues/34805
