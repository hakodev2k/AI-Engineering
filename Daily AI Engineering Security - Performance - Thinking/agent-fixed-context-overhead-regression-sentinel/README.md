# Agent Fixed Context Overhead Regression Sentinel

**Category:** Token  
**Run date:** 2026-09-04 (Vietnam time)

## Problem
AI agent harnesses can spend tens or hundreds of thousands of input tokens before meaningful task context is added. System prompts, tool schemas, rules, skills, MCP definitions, subagent descriptions, memory, and attachments form a fixed baseline that can silently grow after releases, configuration changes, or model/context-tier migrations. The result can be higher cost and latency, earlier compaction, reduced multi-agent throughput, or a request that cannot fit at all.

## Evidence
See `evidence/research.md`. Current public evidence includes an August 2026 Claude Code report of roughly 214k fixed tokens preventing a 200k-context subagent from starting, an August 2026 Codex report that fan-out multiplies per-agent fixed overhead, requests for component-level context attribution, and prior measured fresh-session overhead regressions.

## Existing approach
Users manually disable tools/MCP servers, shorten instructions, reduce skills, start new sessions, or inspect aggregate context/usage counters. These are useful tactics but are reactive and do not establish a release baseline.

## Existing limitations
Aggregate counters do not identify the responsible component; fixed overhead varies by agent/model/profile; larger context windows can mask cost regressions; fan-out multiplies fixed cost; and aggressive trimming can remove context required for correctness or security.

## Proposed improvement
Treat fixed non-task context like a governed build artifact. Measure a fresh-session baseline by component, compare candidate profiles against absolute/relative/context-utilization budgets, fail releases on unexplained regressions, then optimize only the implicated component and verify task quality/security before accepting savings.

## Architecture
```text
agent-fixed-context-overhead-regression-sentinel/
├── README.md
├── config/
│   └── token-budget.json
├── evidence/
│   └── research.md
├── examples/
│   ├── baseline.json
│   └── candidate-regression.json
├── hooks/
│   └── pre-release-context-budget-check.md
├── rules/
│   └── fixed-context-budget-policy.md
├── scripts/
│   └── fixed_overhead_sentinel.py
├── skills/
│   └── fixed-overhead-baseline-analysis.md
├── subagents/
│   └── context-budget-verifier.md
├── tests/
│   └── test_fixed_overhead_sentinel.py
└── workflows/
    └── measure-diagnose-optimize-verify.md
```

## Installation
Python 3.10+; no third-party dependencies. Copy the directory intact.

## Measurement schema
Each baseline/candidate JSON contains `profile`, `model`, `context_limit_tokens`, `fixed_tokens`, and component counts for `system`, `tools`, `rules`, `skills`, `mcp`, `subagents`, `memory_attachments`, and `other`. Component counts must sum exactly to `fixed_tokens`.

## Usage
Run the included regression example:

```bash
python scripts/fixed_overhead_sentinel.py \
  --policy config/token-budget.json \
  --baseline examples/baseline.json \
  --candidate examples/candidate-regression.json
```

The example is intentionally over budget and should exit 2 with explicit violations.

Run tests:

```bash
python -m unittest tests/test_fixed_overhead_sentinel.py
```

## Workflow
Observe → measure fresh baseline → diagnose component deltas → form a configuration/release hypothesis → optimize the implicated component → measure again → if not improved, re-evaluate within two attempts → verify quality/security → promote the new baseline.

## Metrics
- fixed tokens per fresh session/agent
- fixed overhead / context window percentage
- absolute and relative delta vs baseline
- component contribution and component growth
- estimated fan-out fixed cost
- tokens/task, cost/task, and latency/task when available
- task-quality/security regression rate after reduction

## Verification
**Implemented:** deterministic comparison script, component schema, policy, examples, tests, workflow, rules, and independent verifier role exist.  
**Measured:** adopters must capture provider/harness measurements under comparable conditions.  
**Verified:** only after before/after measurements pass policy and task-quality/security checks show no critical context loss.

## Safety
Token optimization MUST NOT remove security, permission, provenance, tool constraints, or task-critical context solely to meet a budget. Context correctness takes precedence over savings. Model/tokenizer changes require an explicit comparison note when counts are not directly equivalent.

## Failure handling
**Detection:** context does not fit, budget breach, component growth, malformed/incomplete attribution, or quality regression.  
**Evidence:** preserve baseline/candidate JSON, profiler report, config/version diff, and tests.  
**Retry policy:** at most two optimization iterations for the same diagnosed regression.  
**Fallback:** retain the previously approved profile.  
**Escalation:** component owner/platform performance reviewer.  
**Stop condition:** measurements are incomparable, required context would need removal, quality/security regresses, or the budget still fails after bounded attempts.

## Definition of Done
- current evidence documented
- fresh-session baseline captured
- existing approaches and limitations identified
- component attribution complete
- candidate compared against policy
- implicated regression root cause documented
- improvement implemented only after diagnosis
- before/after metrics complete
- deterministic tests pass
- task-quality/security regression checks pass
- no critical context removed
- independent verification complete
- no blocking issue remains

## Customization
Adjust budgets to each model/profile instead of copying the example thresholds blindly. Extend components when your harness has distinct categories, but keep totals auditable and avoid merging task history into the fixed-overhead baseline.