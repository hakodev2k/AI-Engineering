# Hook: Pre-Subagent Context Gate

## Trigger
Immediately before serializing a child agent's first model request.

## Preconditions
A context manifest exists and target child budget is known.

## Action
Run `python scripts/context_contract_audit.py <snapshot.json> --budget-tokens <N> --json`. If it reports undeclared optional memory, remove that source and rebuild the manifest. If it reports stale required sources, refresh them once and re-audit. If required context exceeds budget or any violation remains after one refresh, block dispatch.

## Expected result
A child-local, provenance-tagged, current payload within budget without removing required constraints.

## Failure behavior
Audit/parse failure blocks optimized dispatch. Use a known-correct conservative context only if it fits the child model; otherwise escalate.

## Blocks completion
Yes, when a run claims context optimization without a passing audit and quality verification.