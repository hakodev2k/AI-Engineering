# MCP Tool Schema Budget Router

**Category:** Token  
**Generated:** 2026-08-19 (UTC+7)

## Topic
Reduce fixed context-window waste from large MCP/function-tool catalogs by profiling schema cost, selecting only task-relevant full schemas, enforcing a hard tool-schema budget, and keeping a deterministic essential-tool fallback.

## Problem
Tool definitions are model input. When an agent eagerly exposes dozens of MCP tools, JSON Schema, descriptions, nested parameters, annotations, and examples can consume thousands of tokens before task-specific context is added. The cost is structural: even when prompt caching reduces repeated billing, large tool definitions still occupy model context and can create cold-start/cache-fragility overhead.

Current public signals include:
- MCP issue #2808 measuring roughly 100–1,024 tokens per production tool schema and estimating 15–30 KB of context for 20–30 tools.
- Claude Code issue #26158 reporting about 16.5k tokens of fixed tool definitions per conversation.
- Codex issue #33608 showing that deferred MCP tool reachability can fail in a real model/client path, so lazy discovery needs a fallback.
- MCP 2026-07-28 requiring valid JSON Schema for `inputSchema`, meaning optimization must preserve schema correctness.

See `evidence/research.md` for sources and the evidence/interpretation/proposal boundary.

## Existing approach
Common approaches are eager registration, manual shortening of descriptions, prompt caching, provider allowlists, native deferred tool search, and splitting catalogs across MCP servers.

## Existing limitations
- Eager registration wastes fixed context.
- Manual shortening is hard to govern and can harm call correctness.
- Prompt caching does not return occupied context capacity.
- Static allowlists require prior knowledge of required tools.
- Native deferred discovery is client/model dependent and can fail.
- Server splitting adds operational complexity.
- Arbitrary schema minification can break runtime semantics.

## Proposed improvement
Treat the tool catalog as a **budgeted retrieval corpus**:

```text
Full tool catalog
     ↓
Validate + profile schema cost
     ↓
Compact routing metadata
     ↓
Task-aware deterministic selection
     ↓
Hard token/count budget
     ↓
Selected original full schemas
     ↓
Model request
```

If native tool search works reliably, use it and keep this package as a CI guard/fallback. If discovery fails, load the essential set plus a small bounded fallback rather than all tools.

## Architecture
### Control plane
- `config/tool-budget-policy.json` defines budgets, essential tags, fallback and regression thresholds.
- `routing` metadata on catalog entries contains compact tags/keywords used only by the host.

### Measurement plane
- `scripts/schema_profiler.py` validates and estimates model-visible schema size, records per-tool hashes and dominant contributors.

### Selection plane
- `scripts/tool_router.py` chooses essential tools first, then task-relevant tools within budget, preserving model-visible definitions exactly.

### Verification plane
- `tests/test_tool_budget.py` checks catalog validity, routing behavior, bounded fallback, essential reachability, schema preservation and fail-closed budget behavior.
- `verification/report.md` records package verification scope and production measurement requirements.

## Package structure

```text
mcp-tool-schema-budget-router/
├── README.md
├── guide-intergration.md
├── config/
│   └── tool-budget-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── tool-catalog.sample.json
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── schema_profiler.py
│   └── tool_router.py
├── tests/
│   └── test_tool_budget.py
└── verification/
    └── report.md
```

## Installation
Requirements: Python 3.10+; scripts use only the Python standard library.

Clone/copy this package into the agent host repository. No secrets or provider SDK are required for the deterministic profiler/router.

## Configuration
Edit `config/tool-budget-policy.json`:

- `estimatedCharsPerToken`: portable approximation; calibrate for your provider when possible.
- `maxToolSchemaTokens`: hard model-visible schema budget.
- `maxSingleToolTokens`: flags unusually large individual schemas.
- `maxSelectedTools`: hard tool-count bound.
- `essentialTags`: tags that must remain reachable.
- `fallbackAdditionalTools`: bounded expansion when discovery/routing cannot identify candidates.
- `regression.*`: required quality gates.

Do not increase budgets merely to silence failures; record the reason and measure real model/client limits.

## Usage
### Profile the full catalog

```bash
python scripts/schema_profiler.py examples/tool-catalog.sample.json \
  --policy config/tool-budget-policy.json
```

### Route a task

```bash
printf '%s' 'Query the postgres database for invoice rows' > task.txt
python scripts/tool_router.py \
  --catalog examples/tool-catalog.sample.json \
  --task-file task.txt \
  --policy config/tool-budget-policy.json \
  --output selected-tools.json \
  --report routing-report.json
```

### Simulate discovery failure

```bash
python scripts/tool_router.py \
  --catalog examples/tool-catalog.sample.json \
  --task 'tool discovery unavailable' \
  --policy config/tool-budget-policy.json \
  --output selected-tools.json \
  --report routing-report.json \
  --fallback
```

### Run tests

```bash
python -m unittest tests/test_tool_budget.py
```

## Workflow
1. Research current catalog/tool behavior.
2. Profile eager baseline.
3. Tag essential tools and add compact routing metadata.
4. Define budget from model/client constraints.
5. Run router in shadow mode.
6. Evaluate expected-tool selection recall.
7. Test actual non-destructive calls.
8. Enable routed exposure only after quality thresholds pass.
9. Gate future catalog changes in CI.

Full bounded workflows are in `workflows/workflows.md`.

## Metrics
Primary metrics:
- tool schema estimated tokens before/after;
- schema-token reduction ratio;
- catalog vs selected tool count;
- expected-tool selection recall;
- essential-tool reachability;
- tool-call success;
- fallback activation rate;
- task-quality regression rate;
- cold-start input tokens when provider telemetry exposes them.

## Verification
The key rule is **token reduction is not sufficient proof**. A rollout is verified only when:

1. selected schema tokens meet the reduction threshold;
2. selected schemas match original callable definitions;
3. essential tools remain reachable;
4. selection recall meets threshold on representative tasks;
5. runtime tool-call success does not regress beyond policy;
6. fallback remains bounded and rare;
7. no important schema constraints are removed.

Distinguish states:
- **Implemented:** profiler/router/hooks/tests exist and are integrated.
- **Measured:** baseline and routed metrics were collected in the target runtime.
- **Verified:** configured quality and token thresholds passed with runtime evidence.

This repository package can verify package structure/contracts; production claims require measurements from the actual model/client/MCP catalog.

## Safety
- Routing changes visibility, not authorization.
- Keep existing permission checks, approval gates, sandboxing, and runtime validation.
- Treat annotations from untrusted MCP servers as hints, not security enforcement.
- Never put secrets or sensitive arguments in routing metadata/telemetry.
- Never expose the full catalog automatically as a recovery shortcut.

## Failure handling
- Invalid catalog → block exposure.
- Duplicate names → block catalog.
- Essential set exceeds budget → hard failure.
- No task match → essential + bounded fallback.
- Native tool search unavailable → deterministic bounded fallback.
- Recall regression → rollback policy/routing metadata.
- Call-generation regression after description reduction → restore original definition.
- Repeated failure → stop after bounded retries and require owner review.

## Definition of Done
- [ ] Real problem evidence documented.
- [ ] Full catalog baseline captured.
- [ ] Budget policy defined and versioned.
- [ ] Every tool has stable reviewed routing metadata or explicit default behavior.
- [ ] Essential set is defined.
- [ ] Profiler validates the catalog.
- [ ] Router produces a bounded selected set.
- [ ] Selected callable-definition hashes match originals.
- [ ] Native-discovery failure has a tested bounded fallback.
- [ ] Representative task fixtures exist.
- [ ] Selection recall meets configured minimum.
- [ ] Tool-call success meets configured minimum.
- [ ] Schema-token reduction meets configured target.
- [ ] Fallback rate meets configured maximum in representative runs.
- [ ] CI gates catalog changes.
- [ ] No secrets are present in package/config/tests.

## Customization
For larger systems, replace keyword scoring with a deterministic local index or a small routing model, but preserve the same hard contracts:

- essential-first;
- explicit schema-token/count budgets;
- selected full schemas remain semantically unchanged;
- bounded fallback;
- quality evals before rollout;
- fail closed when the required set cannot fit.

For multi-agent systems, maintain separate budgets and essential sets per agent role rather than exposing the union of all tools to every agent.
