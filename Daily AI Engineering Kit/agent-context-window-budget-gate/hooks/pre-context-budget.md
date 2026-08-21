# Pre-context Budget Hook

**Trigger:** Before loading a candidate repository context set into an agent.

**Preconditions:** `config/policy.json` exists and candidate paths are known.

**Action:** Run `python scripts/context_budget.py --policy config/policy.json --output context-manifest.json --task-id <task> <paths...>`.

**Expected result:** Exit 0 and manifest status `ready` or `warning`.

**Failure behavior:** Exit 2 indicates invalid input and blocks execution. Exit 3 indicates blocked budget and blocks execution until low-priority context is reduced.

**Blocking:** Yes.
