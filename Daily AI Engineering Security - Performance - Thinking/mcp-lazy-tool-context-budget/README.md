# MCP Lazy Tool Context Budget

**Category:** Token

## Problem
Large MCP/tool catalogs are often loaded before task relevance is known. Eager schemas consume context and token budget, while discovery of slow/unreachable servers can delay the first model turn.

## Evidence
See `evidence/research.md` for current Claude Code and Codex reports from April–June 2026.

## Existing approach
Teams manually disable servers, use static allowlists, simplify schemas, rely on prompt caching, or use dynamic tool discovery where supported.

## Existing limitations
Manual toggling does not scale; caching does not recover occupied context-window capacity; global allowlists are not task-aware; lazy loading can omit required capabilities unless correctness is explicitly verified.

## Proposed improvement
Measure every tool/server's schema-token and startup cost, declare critical/task-required capabilities, and generate a deterministic activation plan constrained by token and startup budgets. Defer optional low-value tools and independently verify the same task corpus before accepting savings.

## Architecture
```text
mcp-lazy-tool-context-budget/
├── README.md
├── evidence/research.md
├── config/budget.json
├── scripts/tool_activation_plan.py
├── tests/test_tool_activation_plan.py
├── skills/context-budget-analysis.md
├── rules/context-budget.md
├── subagents/token-verifier.md
├── workflows/measure-budget-verify.md
└── hooks/pre-session-budget.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/budget.json` with measured limits for schema tokens and startup latency. Mark truly correctness-critical tools in inventory data; do not use criticality as a convenience ranking.

## Usage
Prepare `inventory.json` with tool records containing `name`, measured `schema_tokens`, measured `startup_ms`, optional `tags`, `critical`, and `relevance`. Prepare `task.json` with `required_tools` and/or `required_tags`. Run:

`python scripts/tool_activation_plan.py --inventory inventory.json --budget config/budget.json --task task.json`

## Workflow
Use `workflows/measure-budget-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Budget/activate → Measure again → Independent verify.

## Metrics
- tool-schema/input tokens per task
- context utilization
- startup/first-turn latency
- total task latency
- cost/task
- critical-tool recall
- result quality
- regression rate

## Verification
Run `python -m unittest tests/test_tool_activation_plan.py`, then benchmark the same representative task corpus before and after activation changes. Independent `subagents/token-verifier.md` review is required before declaring verified savings.

## Safety
This package never removes correctness-critical context solely for cost savings. If required tools exceed the budget, planning fails closed so the owner must raise the budget, simplify schemas, or redesign discovery.

## Failure handling
**Detection:** required capability exceeds budget or benchmark quality regresses.  
**Evidence:** planner JSON plus before/after benchmark metrics.  
**Retry policy:** adjust budget/relevance at most twice.  
**Maximum retries:** 2.  
**Fallback:** restore baseline tool activation.  
**Escalation:** required tool inventory is too large or correctness cannot be preserved.  
**Stop condition:** critical capability loss, regression beyond tolerance, missing baseline, or retries exhausted.

## Definition of Done
**Implemented:** deterministic activation planning and lazy/deferred integration are reproducible.  
**Measured:** baseline and after metrics include token, latency, cost and quality dimensions.  
**Verified:** unit tests pass, representative-task quality and critical-tool recall do not regress beyond policy, and positive savings are independently confirmed.

## Customization
Replace manually supplied relevance with your own deterministic task classifier or tool-search score, but retain explicit critical/required overrides and before/after verification.
