# Agent MCP Tool-Schema Budget Gate

## Topic
Prevent eager MCP/tool-schema injection from consuming excessive context by measuring catalog footprint and promoting only task-relevant full schemas under an explicit token budget.

## Category
**Token**

## Problem
Tool-heavy AI agents can load every enabled MCP/tool definition into the model context before the task needs them. Public reports in MCP, Codex, and Claude Code show that this can consume tens of thousands of tokens. The cost scales with catalog size and schema verbosity rather than actual task need.

## Evidence
`evidence/research.md` documents current signals including MCP issue #2808, Codex issue #14507, Claude Code issues #26415/#23787, MCP SEP #1576, the current MCP tools specification, and 2026 tool-discovery research.

## Existing approach
Common approaches are eager registration, manual server enable/disable, hand-trimmed descriptions, or platform-specific deferred tool loading/tool search.

## Existing limitations
- eager registration pays context cost for unused tools;
- manual toggles do not scale across tasks/agents;
- description trimming can damage tool-selection quality and cannot solve large catalogs alone;
- retrieval/deferred loading introduces recall risk unless teams measure it and provide bounded fallback.

## Proposed improvement
Use a **budget gate** at the model boundary:
1. inventory the full catalog;
2. measure full schema footprint;
3. preserve explicitly pinned/required tools;
4. retrieve candidate tools from task intent;
5. promote full schemas only while within target/hard budgets;
6. use bounded fallback when confidence is low;
7. verify required-tool recall and task quality before rollout.

The included selector is a deterministic lexical baseline. Hosts can replace it with embeddings or provider-native tool search while preserving the same budget and verification contract.

## Architecture
`MCP servers/tool registry → catalog export → schema profiler → task selector → budget/pin gate → selected full schemas → model request`

A Verification Agent independently checks recall and regression. Catalog changes invalidate selection/index verification.

## Package structure
```text
agent-mcp-tool-schema-budget-gate/
├── README.md
├── guide-intergration.md
├── evidence/
│   └── research.md
├── config/
│   └── tool-budget.json
├── scripts/
│   └── tool_schema_budget.py
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
└── tests/
    └── test_tool_schema_budget.py
```

## Installation
Requires Python 3.10+ and no third-party packages for the shipped baseline.

Clone/copy this package into the agent-host repository. Export the host-visible tool catalog as JSON. No network access is required by the script.

## Configuration
Edit `config/tool-budget.json` after measuring the real workload.

Important fields:
- `max_schema_tokens`: hard promoted-schema ceiling;
- `target_schema_tokens`: preferred ceiling;
- `max_selected_tools`: candidate-count bound;
- `min_retrieval_score`: lexical confidence threshold;
- `pinned_tools`: tools that may never be silently removed;
- `fallback_expand_by`, `max_fallback_rounds`: bounded recovery;
- quality/recall thresholds used by the host verification process.

The defaults are examples, not universal production values.

## Usage
### Audit the full catalog
```bash
python scripts/tool_schema_budget.py catalog.json --mode audit
```

### Select a task-scoped catalog
```bash
python scripts/tool_schema_budget.py catalog.json \
  --mode select \
  --query "find recent MCP issues about token usage" \
  --required github_search_issues \
  --output selected-tools.json
```

Exit codes:
- `0`: policy pass;
- `2`: budget/selection blocked;
- `3`: invalid input;
- `4`: I/O or parse failure.

## Workflow
Primary workflow is **Measure → Diagnose → Hypothesize → Select → Measure again → Verify**. Low-confidence selection uses a bounded expansion loop and stops instead of infinitely retrying or silently omitting tools. See `workflows/workflows.md`.

## Token accounting
The script uses a dependency-free UTF-8 byte estimator (`bytes / 3.6`) so measurements are deterministic everywhere. This is intentionally labeled **estimated**. For production cost/accounting, integrate the target provider/model tokenizer and retain both estimator and exact measurements for regression continuity.

## Metrics
Minimum metrics:
- full and selected schema tokens;
- schema token reduction ratio;
- selected tools / total tools;
- required-tool recall;
- false exclusion rate;
- selector latency;
- fallback count;
- representative task-quality regression;
- exact vs estimated measurement method.

Never infer lower provider cost or latency solely from the local estimate.

## Verification
### Implemented
- deterministic catalog audit;
- budgeted task-scoped selector;
- pinned/required-tool preservation;
- hard-budget blocking;
- low-confidence blocked state;
- bounded fallback workflow contract;
- regression tests and independent verifier role.

### Measured
A deployment reaches **Measured** when baseline and post-gate token footprint are captured on its actual catalog and model/runtime, plus selector latency and benchmark recall.

### Verified
A deployment reaches **Verified** only when:
- post-gate schema footprint is lower than baseline;
- required-tool recall meets configured threshold (normally 100% for explicit required tools);
- task-quality regression remains within tolerance;
- pinned tools are preserved;
- fallback behavior is bounded and tested;
- measurement method is explicit;
- independent Verification Agent approves the results.

Package generation does not claim that an external production runtime has already achieved these deployment-specific measurements.

## Tests
Run:
```bash
python -m unittest tests/test_tool_schema_budget.py
```

The included tests cover deterministic audit, relevant selection, required-tool preservation, missing required tools, and zero-overlap blocking. Production adopters should add benchmark fixtures from real task traces.

## Safety
- Never remove explicitly required tools merely to reduce tokens.
- Never remove validation constraints, destructive-action warnings, authorization metadata, or safety semantics from schemas solely for compression.
- Do not use unlimited fallback or recursive selection retries.
- Do not feed secrets into selector logs or benchmark fixtures.
- When the full catalog cannot fit and retrieval cannot safely identify required tools, stop/escalate instead of proceeding with an incomplete hidden capability set.

## Failure handling
**Detection:** script exit code, blocked selection report, benchmark recall failure, catalog fingerprint change, or quality regression.

**Evidence:** retain sanitized catalog fingerprint/version, selected names/scores, token metrics, fallback round, benchmark case IDs, and verifier outcome.

**Retry policy:** deterministic parse/schema errors receive no blind retry; selector tuning is limited to two rounds; runtime fallback is bounded by config.

**Fallback:** expand candidate set within the hard budget or use explicit required-tool routing/provider-native tool search.

**Escalation:** human/orchestrator action is required when required tools exceed the hard budget, required-tool identity is unknown after bounded fallback, or benchmark quality remains below threshold.

**Stop condition:** no safe budget-compliant selection can be demonstrated.

## Definition of Done
- current public evidence documented;
- baseline method defined;
- existing approaches and gaps documented;
- executable selector present with meaningful exit codes;
- Skills, Rules, Subagents, Workflows, Hooks complete;
- required-tool preservation enforced;
- bounded retry/fallback defined;
- tests present;
- before/after metrics defined;
- independent verification criteria defined;
- security/correctness boundaries preserved;
- every README reference resolves to a generated file;
- no secret or destructive automation included.

## Customization
Replace lexical retrieval with a production selector by preserving `name → score → selected` observability and the same pin/budget/fallback contract. Add model-specific exact tokenizers, server-level prefilters, semantic indexes, task classes, or separate budgets per agent role. Re-run all regression gates after any schema, selector, model, or budget change.
