# Hook — Context Regression Gate

## Trigger
After a capability-context optimization and before merging/rolling out a host, plugin, MCP, skill-catalog, or lazy-loading change.

## Preconditions
Comparable baseline/candidate JSON snapshots and a policy JSON exist. Representative task-quality tests have not been weakened.

## Action
Run:

```sh
python scripts/context_budget_reconcile.py \
  --baseline .context/baseline.json \
  --candidate .context/candidate.json \
  --policy config/budget.example.json \
  --output .context/reconciliation.json
```

Then check the independent quality suite against `required_quality_floor` from policy.

## Expected result
Script exit `0`, `status=pass`, candidate within total budget, expected removal reflected in total tokens, no category growth over threshold, and quality at/above floor.

## Failure behavior
- Exit `2`: block completion and preserve reconciliation evidence.
- Exit `3`: block because inputs are invalid or unreadable.
- Quality below floor: block regardless of token savings and restore last verified configuration when possible.
- Allow at most three workflow hypotheses; never weaken the quality/security gate to obtain a pass.

## Blocks completion
Yes.

## Determinism
The supplied script performs only arithmetic over explicit snapshots and policy. Semantic quality remains the responsibility of an unchanged external test suite, deliberately separated from token accounting.
