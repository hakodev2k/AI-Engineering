# Research — MCP Skill Lazy Materialization Budget Guard

## Topic
Bounded, lazy materialization of Skills-over-MCP resources.

## Category
Performance

## Problem
Skills-over-MCP can expose large catalogs where each skill references multiple resources. A naive client that eagerly fetches every listed skill and every resource at connection time can generate a request fan-out proportional to catalog size × files per skill, delaying startup and loading servers even when most skills are never used.

## Why it matters now
The Skills-over-MCP working group is actively converging on V1 semantics. August 2026 maintainer notes explicitly call out the strain of every connecting client downloading about 150 skills with one request per resource, while the working group is adding advisory file-count/file-size limits and discussing caching. OpenAI has already implemented the extension in an install-a-snapshot style, so these are implementation concerns, not merely theoretical design questions.

## Affected users
- MCP client/host implementers supporting remote skills.
- MCP servers serving large skill catalogs.
- Platform teams operating shared MCP gateways.
- Agent users experiencing slow startup or unnecessary context/download work.

## Current public evidence

### Observed evidence
1. MCP Core Maintainer Meeting notes from 2026-08-12 state that every connecting client downloading roughly 150 skills with a request per resource creates real strain on servers. They also note overlapping retrieval paths (`skills/list`, `skills/get`, directory resources) that can disagree and need a more opinionated default. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3257
2. Skills-over-MCP WG notes from 2026-08-11 say OpenAI has implemented the current extension, advisory file size/file count limits are being added, caching remains an open V1 question, and no current reference client exists against the latest version outside in-the-wild implementations. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3230
3. The extension decision log says V1 was intentionally narrowed to per-file digests, `skills/list` + `skills/get`, and optional directory enumeration; archive delivery was removed partly because of governance and execution-risk complexity. Source: https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/decisions.md
4. The earlier GitHub MCP experiment bundled roughly 28 skills and exposed both static skill resources and templates, demonstrating that real servers can already present nontrivial skill inventories. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2766

### Interpretation
Progressive disclosure is the intended architectural direction, but clients still need concrete budgets and measurable materialization rules. Merely adding caching does not prevent a cold-start fetch storm, and advisory server limits do not decide which skills a client should load for a specific task.

## Existing approaches
- `skills/list` for catalog discovery and `skills/get` for individual entries.
- Per-file digests to detect unchanged content.
- Cache hints/TTL mechanisms in the 2026-07-28 protocol family.
- Advisory skill file-count/file-size limits.
- Progressive disclosure concepts: summary first, body/resources on demand.
- Snapshot installation in current implementations.

## Remaining limitations
- Cold caches still allow eager download amplification.
- A client can obey every per-skill size limit yet fetch too many skills at once.
- Duplicate or overlapping discovery paths can trigger repeated fetches.
- Static TTL does not encode task relevance.
- No universal reference-client policy currently defines startup request/byte budgets or concurrency limits.
- Unbounded parallel fetches can trade latency for server overload and queue contention.

## Root-cause analysis
1. Discovery and materialization are different phases but are often implemented as one eager loop.
2. Catalog metadata is cheap; resource bodies are comparatively expensive.
3. Clients optimize locally for “everything ready” while externalizing load to shared servers.
4. Caching addresses repetition, not first-touch fan-out.
5. Missing task-level budgets make it difficult to prove an optimization or regression.

## Improvement opportunity
Introduce a deterministic materialization planner: ingest skill metadata, score requested/relevant skills, honor cache digests, then allocate a bounded request/byte budget with capped concurrency. Materialize only selected skill bodies/resources. Measure cold-start requests, bytes, latency, cache hits, and task quality before and after.

## Proposed solution
This package provides a dependency-free planner over JSON skill manifests, performance rules, baseline/optimization skills, a benchmark-oriented workflow, an independent performance verifier, a prefetch-budget hook, and tests for eager-vs-lazy behavior.

## Goal
Reduce unnecessary startup/resource requests and transferred bytes without losing task-required skills.

## Metrics
- requests per connection/task
- bytes fetched per connection/task
- p50/p95 materialization latency
- cache hit ratio
- selected-skill precision/recall against task-required skills
- concurrent resource fetches
- server 429/5xx rate
- quality/regression rate on representative tasks

## Trigger
Client connect, catalog refresh, task start, skill selection, or cache invalidation.

## Inputs
Skill catalog metadata, task relevance scores/required skill IDs, cache digests, per-resource sizes when known, request budget, byte budget, concurrency cap.

## Outputs
Ordered fetch plan, skipped reasons, projected requests/bytes, cache-hit decisions, and budget-exhaustion signal.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3257
- https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3230
- https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/decisions.md
- https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2766
