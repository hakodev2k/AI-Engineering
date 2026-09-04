# Hook: Pre-Release Context Budget Check

## Trigger
Before releasing or enabling an agent profile whose model, context tier, prompt, tools, skills, MCP servers, subagents, or persistent memory changed.

## Preconditions
Approved baseline JSON, candidate fresh-session JSON, and `config/token-budget.json` exist.

## Action
Run the deterministic sentinel and retain its JSON report as release evidence.

## Command
`python scripts/fixed_overhead_sentinel.py --policy config/token-budget.json --baseline baseline.json --candidate candidate.json`

## Expected result
Exit code 0 with `status=ok`. The candidate must fit the context and remain within absolute, relative, utilization, and component-growth thresholds.

## Failure behavior
Block rollout. Diagnose dominant components. Do not remove security/correctness-critical context to force a pass. A documented human exception may change a budget only after reviewing cost, fit, and quality impact.

## Blocking
Yes for the governed profile. Failure is not converted into a warning automatically.