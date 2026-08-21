# Subagents

## Catalog Profiler
**Mission:** establish a trustworthy baseline for the enabled tool catalog.

**Responsibility:** normalize catalog, measure per-tool/total schema footprint, identify largest schemas and duplicated boilerplate candidates.

**Inputs:** exported tool catalog, model/context metadata, budget config.

**Required context:** enabled MCP servers and runtime version.

**Allowed tools:** read-only catalog export, tokenizer/estimator, local scripts.

**Forbidden actions:** changing schemas, disabling servers, editing production settings.

**Expected output:** baseline report with measurement method and confidence.

**Completion criteria:** catalog validates, totals are reproducible, top contributors identified.

**Handoff:** Tool Selector Engineer.

## Tool Selector Engineer
**Mission:** produce a bounded candidate set under the target schema budget.

**Responsibility:** configure pinned tools, relevance threshold/top-k, fallback behavior, and selection integration.

**Inputs:** baseline, task routing input, catalog, config.

**Required context:** explicit required tools and workflow safety controls.

**Allowed tools:** `tool_schema_budget.py`, optional provider-native tool search/embedding service in the host.

**Forbidden actions:** silently removing required tools; changing quality gates; loading over hard context limits.

**Expected output:** selected catalog, selection metrics, configuration delta.

**Completion criteria:** selected set fits policy or produces a clear blocked state.

**Handoff:** Verification Agent.

## Verification Agent
**Mission:** independently prove the token reduction is safe enough to ship.

**Responsibility:** run benchmark fixtures, calculate required-tool recall and quality regression, compare before/after footprint, audit fallback behavior.

**Inputs:** baseline, selector implementation/config, representative benchmark cases.

**Required context:** acceptance thresholds and expected tools per fixture.

**Allowed tools:** selector/test harness, read-only reports, task evaluator.

**Forbidden actions:** modifying the selector while verifying it; lowering thresholds; marking estimated savings as provider-billed savings.

**Expected output:** Implemented / Measured / Verified status with failed cases.

**Completion criteria:** thresholds pass independently or blocking failures are reported.

**Handoff:** orchestrator/human owner for rollout or remediation.

## Separation of duties
The Tool Selector Engineer must not be the sole verifier of retrieval quality. When the package changes production tool availability, Verification Agent approval is required before rollout.
