# MCP Tool Schema Budget Gate

## Topic
A reusable Token-engineering package for measuring, budgeting, and regression-testing MCP tool-definition context before it reaches an AI agent.

## Category
**Token** — with secondary Performance benefits.

## Problem
Large MCP tool inventories can consume substantial context before useful task data is loaded. Deferred tool discovery helps, but public issue history shows that auto-activation can regress, deferred name registries still consume context, and teams often lack a repository-owned budget that survives client/provider changes. The result is wasted context capacity, more frequent compaction, higher input-token cost, and sometimes degraded tool selection.

## Evidence
`evidence/research.md` records current public signals as of 2026-08-20 UTC+7, including measured tool-schema overhead in the MCP project, Claude Code deferred-loading regressions, hierarchical-discovery requests, and MCP's current list-caching behavior.

## Existing approach
Common approaches are: preload all tools, rely on client Tool Search/deferred loading, manually toggle servers, create server-specific toolsets, or rely on prompt caching. These can help, but none provides a provider-neutral, versioned, testable schema budget owned by the application repository.

## Existing limitations
- preloading spends context on unused tools;
- deferred loading is implementation-dependent and has had regressions;
- deferred indexes can still create name-list overhead;
- manual toggling is easy to forget;
- prompt caching reduces repeated processing cost but not model context occupancy;
- naive schema trimming can damage tool selection or input safety.

## Proposed improvement
Introduce a deterministic preflight gate that inventories full tool definitions, calculates a per-tool and aggregate footprint, classifies tools as `hot`, `deferred`, or `disabled`, compares against an approved baseline, and blocks regressions. Token reduction is accepted only when a fixed capability test suite confirms required tools remain discoverable and usable.

## Architecture
```text
MCP tool inventory
      |
      v
canonical JSON -----> token counter/estimator
      |                       |
      |                       v
      +-----------------> budget report
                              |
                    +---------+----------+
                    |                    |
                 policy pass          violation
                    |                    |
                    v                    v
          hot/deferred/disabled     review/rollback
                    |
                    v
             capability tests
                    |
                    v
          independent verification
```

## Package structure
```text
mcp-tool-schema-budget-gate/
├── README.md
├── guide-intergration.md
├── evidence/research.md
├── config/budget.json
├── skills/core-skills.md
├── rules/engineering-rules.md
├── subagents/subagents.md
├── workflows/workflows.md
├── hooks/hooks.md
├── scripts/tool_schema_budget.py
├── examples/tools.json
└── tests/test_budget.py
```

## Installation
Requires Python 3.9+ and otherwise uses only the standard library. Copy the package into your repository and export MCP tool definitions to JSON. Optional exact tokenization can use `tiktoken` when installed in the copied package's environment:

```bash
python -m pip install "tiktoken>=0.7,<1"
```

## Configuration
Edit `config/budget.json`:
- `max_total_tokens`: maximum total inventory footprint;
- `max_hot_tokens`: maximum initial hot-tool footprint;
- `max_tool_tokens`: hard limit per tool;
- `warn_tool_tokens`: review threshold;
- `max_hot_tools`: maximum initially exposed tool count;
- `min_reduction_percent`: required reduction when a baseline is supplied;
- `tokenizer`: `estimate` or `tiktoken:<encoding>`;
- `hot_tools`, `disabled_tools`, `required_tools`: names or `server::name` keys.

The sample numbers are defaults for demonstration, not universal safe values. Tune them from your own baseline and model/runtime limits.

## Usage
Run the included self-test:
```bash
python tests/test_budget.py
```

Measure the example:
```bash
python scripts/tool_schema_budget.py examples/tools.json --config config/budget.json --report report.json
```

Compare a candidate inventory against a baseline:
```bash
python scripts/tool_schema_budget.py tools.json --config config/budget.json --baseline baseline-report.json --report candidate-report.json
```

Exit codes are `0` pass, `2` policy violation, and `3` invalid input/config.

## Workflow
Use the evidence-driven loop in `workflows/workflows.md`: **Observe → Baseline → Cause → Hypothesis → Implement → Measure → Capability Test → Verify**. Optimization retries are bounded to two iterations per change set. A missing required tool, security-boundary change, unverifiable inventory, or repeated failure stops the workflow and escalates.

## Skills
`skills/core-skills.md` includes three executable skills: footprint audit, budgeted exposure design, and client-regression preflight. Each defines inputs, procedure, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines enforceable MUST/MUST NOT/SHOULD constraints. Most importantly, token savings cannot override authorization, destructive-action approval, schema validation, or correctness requirements.

## Subagents
`subagents/subagents.md` separates inventory/evidence, exposure planning, implementation, and independent verification. The implementing agent is not the sole verifier.

## Hooks
`hooks/hooks.md` defines pre-task inventory, pre-merge schema regression, client-upgrade preflight, post-change capability, and final verification hooks.

## Metrics
Track:
- total tool-schema tokens per session/profile;
- hot-tool tokens and hot-tool count;
- tokens per tool and server share;
- reduction versus baseline;
- required-tool discovery success;
- tool-selection success on representative tasks;
- false-disable rate;
- number of client upgrades that change initial schema footprint unexpectedly.

## Verification
Keep three statuses distinct:
- **Implemented:** policy/toolset/schema change exists.
- **Measured:** candidate footprint was measured using a recorded counting method.
- **Verified:** independent capability and regression checks passed.

A lower token count alone is not verification.

## Safety
Do not put secrets or user tool arguments in measurement fixtures. Do not remove input constraints, approval semantics, or authorization controls for token savings. If a tool is large because its schema is necessary for safe use, retain it and explicitly accept or redesign the budget with review.

## Failure handling
- malformed inventory/config: exit 3 and fix the source;
- budget violation: exit 2 and block rollout;
- required tool missing: block rollout immediately;
- discovery regression after client upgrade: retry once in a clean session, then block;
- capability regression after optimization: restore the last passing exposure policy;
- inability to obtain exact token counts: use the estimator but label the result as estimated and avoid provider-exact claims.

## Definition of Done
The package integration is complete only when:
1. current tool inventory is documented and measured;
2. counting method is recorded;
3. budget policy is versioned;
4. current approach and limitations are documented;
5. candidate policy passes total/hot/per-tool limits;
6. required tools remain available;
7. representative hot/deferred/negative selection tests pass;
8. security and approval boundaries are unchanged or strengthened;
9. baseline/candidate metrics are preserved;
10. an independent verifier marks the change Verified;
11. no blocking budget, capability, or security issue remains.

## Customization
For small projects, use one policy file per repository. For larger platforms, maintain task-profile policies such as `coding`, `incident-response`, and `data-analysis`, each with its own required/hot set and baseline. If the host does not support deferred discovery, map `deferred` classifications to explicit task-specific toolsets or server profiles rather than assuming runtime behavior that does not exist.

See `guide-intergration.md` for step-by-step integration.
