# Agent Context Budget Preflight Enforcer

**Category:** Token / Performance

## Problem
Agent runtimes often discover context overflow too late: after tool schemas, memory, history, retrieved documents, and tool outputs have already been assembled. Current framework issues show token-budget compaction can be configured yet not run before a model call, while smaller-context agents can spend most of the window before the user's task begins.

## Evidence
See `evidence/research.md` for current public signals, existing approaches, remaining gaps, and source links.

## Existing approach and limitation
Frameworks commonly offer compaction, truncation, summarization, and context-window parameters. These help only when they run at the correct lifecycle point and account for every context component. Post-run compaction cannot prevent the current call from overflowing.

## Proposed improvement
Run a deterministic preflight budget gate immediately before every model request. Measure static instructions, tool schemas, retrieved content, history, memory, tool results, reserved output budget, and safety margin. If over budget, apply configured reductions in a safe order and re-measure; otherwise block rather than silently dropping critical context.

## Architecture
```text
assembled context -> preflight analyzer -> budget report
                         |
                  within budget? ---- yes -> model
                         |
                        no
                         v
             bounded reduction workflow
                         |
                  remeasure <= 2 cycles
                         |
                 still over -> block/escalate
```

## Package tree
```text
README.md
evidence/research.md
config/budget.json
skills/context-budget-analysis.md
rules/context-budget.md
subagents/context-verifier.md
workflows/preflight-and-reduce.md
hooks/pre-model-call.md
scripts/context_budget.py
tests/test_context_budget.py
```

## Installation
Python 3.11+. The deterministic analyzer uses only the standard library and accepts component token counts produced by the host tokenizer/SDK.

## Configuration
Set model context window, reserved output tokens, safety margin, per-component priority, and maximum reduction cycles in `config/budget.json`. Do not guess model limits in production; obtain them from provider/model configuration.

## Usage
```bash
python scripts/context_budget.py context.json --policy config/budget.json
python -m unittest tests/test_context_budget.py
```
Exit `0` means the assembled request fits; `3` means reduction/block is required; `2` means invalid measurement/configuration.

## Workflow
Follow `workflows/preflight-and-reduce.md`. Capture a baseline first, diagnose the largest components, reduce only non-critical/reloadable context, measure again, and stop after bounded attempts.

## Metrics
- Requests exceeding provider context limit after preflight: 0.
- Input tokens/task.
- Reserved-output compliance rate.
- Context utilization ratio.
- Tokens removed by component.
- Quality/regression pass rate on representative tasks.

## Verification states
- **Implemented:** analyzer, policy, hook, workflow and tests exist.
- **Measured:** host captures component counts before and after reduction.
- **Verified:** independent verifier confirms no critical context loss and representative task quality remains within project thresholds.

## Safety
Never delete system/security instructions, explicit user constraints, current task inputs, required authorization context, or evidence needed for correctness merely to fit a budget.

## Failure handling
Invalid measurement or unknown model limit blocks automatic reduction. Maximum reduction cycles default to 2. If still over budget, split work, start a continuation session with verified checkpoint, choose a larger model/context window, or escalate.

## Definition of Done
Baseline captured; all context components measured; request fits with output reserve and safety margin; bounded reduction policy applied when required; regression fixtures pass; no critical context removed; independent verification complete.

## Customization
Integrators can replace approximate host token counts with provider-native tokenizer counts and add component-specific reducers without changing the fail-safe preflight contract.