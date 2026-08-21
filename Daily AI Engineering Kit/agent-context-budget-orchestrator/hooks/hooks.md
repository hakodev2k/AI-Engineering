# Hooks

## PreTask

**Trigger:** before non-trivial task execution.

**Action:** create or validate `context-ledger.json` and confirm budget config exists.

**Command:**

```bash
python .ai/agent-context-budget-orchestrator/scripts/validate-context-ledger.py context-ledger.json
```

If the ledger does not yet exist, create it from the example before continuing.

**Failure behavior:** stop context-dependent execution until the ledger is valid.

## PostContextUpdate

**Trigger:** after adding, removing, compressing, or refreshing ledger entries.

**Action:** validate structure and calculate budget usage.

**Commands:**

```bash
python .ai/agent-context-budget-orchestrator/scripts/validate-context-ledger.py context-ledger.json
python .ai/agent-context-budget-orchestrator/scripts/calculate-context-budget.py --ledger context-ledger.json --config .ai/agent-context-budget-orchestrator/config/context-budget.example.json
```

**Failure behavior:** do not continue expansion when budget is exceeded; compress or escalate.

## PostEdit

**Trigger:** after application files are materially changed.

**Action:** mark ledger items sourced from changed files as stale until reread.

**Command:** project adapter or agent action; no generic destructive script is provided because source-to-ledger mapping is semantic.

**Failure behavior:** final verification must not use those stale items.

## PreHandoff

**Trigger:** before handing work to another agent.

**Action:** run compression skill; preserve task state, critical evidence, decisions, changed files, unresolved questions, and next action.

**Failure behavior:** if a safe compact handoff cannot be produced, pass source identifiers instead of lossy conclusions.

## PreComplete

**Trigger:** before declaring success.

**Action:** validate ledger, calculate budget, refresh stale critical evidence, and run Context Verifier.

**Failure behavior:** distinguish `implemented` from `verified`; never report verified when any mandatory check fails.
