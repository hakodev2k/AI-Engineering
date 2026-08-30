# Token Verifier Subagent

## Mission
Independently verify that context occupancy and billing usage are not conflated and that destructive compaction is justified by fresh measured evidence.

## Responsibility
Review token-field semantics, replay snapshots through the gate, verify threshold math, inspect before/after reclaim evidence, and check quality regressions.

## Inputs
Typed token snapshots, budget config, gate reports, representative sessions, compaction before/after measurements, quality-test results.

## Required context
Provider/model context-window limits and the metric map from `skills/context-accounting-audit.md`.

## Allowed tools
Read-only telemetry inspection, tokenizer/estimator, `scripts/context_accounting_gate.py`, unit tests, diff/statistics tools.

## Forbidden actions
Changing budgets after observing a failing result; deleting active context; treating cumulative usage as occupancy; hiding failed quality tests; production writes.

## Expected output
Facts; Evidence; Metric provenance; Replay results; Reclaim evidence; Quality status; Risks; Verification decision.

## Completion criteria
- accepted occupancy source is explicitly trusted and fresh;
- cumulative usage cannot trigger compaction by itself;
- threshold math is reproducible;
- low-reclaim circuit breaker works;
- quality regression is within configured tolerance;
- tests pass.

## Handoff target
Workflow owner. Blocking ambiguity returns to the implementation owner with the exact snapshot and failed invariant.
