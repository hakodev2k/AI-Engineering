# Token Budget Audit

## Purpose
Detect token overspend before an AI task becomes expensive, slow, or context-fragmented.

## When to use
Use before execution, after major context expansion, and before final verification.

## Inputs
- `config/policy.yaml`
- stage usage counts: task input, planning, execution context, verifier
- repository evidence showing why large context was loaded

## Preconditions
Usage counts must be deterministic estimates or provider-reported values. Do not invent missing counts.

## Allowed tools
Repository read/search, token counters, provider usage metadata, `scripts/token_budget_gate.py`.

## Process
1. Load the policy and identify stage and total limits.
2. Record current stage usage in the usage contract.
3. Run the gate script.
4. If status is `pass`, continue.
5. If status is `warn`, identify the three largest token sources and request one bounded compaction pass.
6. If status is `block`, stop execution and preserve the report.
7. A human may approve an override only with reason, new ceiling, and scope.
8. Re-run the gate after compaction or approved override.

## Output
A `budget-report.json` matching `schemas/budget-report.schema.json`, plus evidence for any warning or block.

## Verification
Policy loaded, all four usage fields present, gate exit code interpreted, and no blocked stage continues silently.

## Failure handling
Invalid usage input is a validation failure and blocks execution. Tool failure may be retried once. A second failure stops the workflow with collected stderr.

## Stop conditions
Stop on invalid counts, policy parse failure, total budget block, or stage-budget violation without approval.
