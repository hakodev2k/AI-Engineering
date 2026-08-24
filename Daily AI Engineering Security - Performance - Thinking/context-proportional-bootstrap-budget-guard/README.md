# Context-Proportional Bootstrap Budget Guard

**Category:** Token

## Problem
Agent runtimes often inject a nearly fixed bootstrap payload—system instructions, tool schemas, skills, memory, and policy text—regardless of the model context window. On 4K/8K/16K models, the bootstrap can consume most usable context before the user task begins.

## Evidence
See `evidence/research.md`. Current 2026 reports from Odysseus and OpenClaw describe prompt bloat that disproportionately harms smaller/local models; GitHub Copilot documentation confirms system instructions/tool definitions are a fixed context cost and tool results accumulate afterward.

## Existing approach and limitation
Compaction, summarization, and tool-output spillover usually act after context has already been consumed. Endpoint-specific compact modes are insufficient when they do not use the model's actual context size. The improvement here is a deterministic **pre-turn bootstrap budget** that allocates context by function and degrades optional context before correctness-critical context.

## Architecture
```text
.
├── README.md
├── evidence/research.md
├── config/budget-policy.json
├── skills/bootstrap-budget-analysis.md
├── rules/context-budget-rules.md
├── subagents/context-budget-reviewer.md
├── workflows/measure-and-rightsize.md
├── hooks/pre-turn-budget-check.md
├── scripts/bootstrap_budget.py
└── tests/test_bootstrap_budget.py
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Usage
```bash
python scripts/bootstrap_budget.py --context-window 8192 --manifest manifest.json --policy config/budget-policy.json
python -m unittest tests/test_bootstrap_budget.py
```

`manifest.json` is an array of components with `name`, `kind`, `tokens`, `required`, and optional `priority`.

## Workflow
Measure the real bootstrap payload, calculate the allowed bootstrap cap from the active model context, classify required vs optional components, evict or compact optional components in priority order, then measure again. At most two adjustment iterations are permitted before escalation.

## Metrics
- bootstrap tokens and bootstrap/context ratio
- tokens left for user task + tool results + output reserve
- optional tokens evicted
- number of tools/skills loaded at first turn
- task quality regression rate on a representative eval set
- context-overflow / premature-compaction incidence

## Verification
**Implemented:** policy, analyzer, workflow and deterministic checker exist.

**Measured:** baseline and post-change bootstrap tokens are recorded for each target model tier.

**Verified:** the budget passes, required components remain present, representative task quality does not regress beyond the configured tolerance, and overflow/compaction incidence is no worse.

## Safety
Required policy, security, authorization, task constraints and output reserve MUST NOT be removed to save tokens. Unknown context windows fail to advisory mode rather than guessing an unsafe cap.

## Failure handling
A blocking budget failure must report the excess tokens and largest optional contributors. Retry at most twice after explicit pruning/compression changes. If still over budget, use a larger-context model or reduce enabled capabilities; do not silently delete required context.

## Definition of Done
Evidence documented; baseline captured; bootstrap ratio within policy; required context retained; before/after metrics captured; tests pass; representative quality check passes; no blocking issue remains.