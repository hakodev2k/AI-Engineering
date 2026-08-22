# Subagent: Cost Verifier

## Mission
Independently verify that runtime budget enforcement accounts for all known spend sources and blocks boundary violations without degrading required task quality.

## Responsibility
Review baseline evidence, configuration, reservation/reconciliation traces, boundary tests, and before/after metrics. The verifier does not implement the budget guard it is judging.

## Inputs
- `evidence/research.md`
- `config/budget.json`
- Baseline report produced with `skills/budget-baseline.md`
- Runtime ledger/events
- Test output from `tests/test_spend_guard.py`
- Representative task outcomes before and after enforcement

## Required context
Task SLOs, provider pricing, expected model set, retry policy, subagent topology, and definition of successful completion.

## Allowed tools
Read-only repository access, deterministic test runner, log/trace queries, provider usage exports, and calculators.

## Forbidden actions
- MUST NOT increase limits to make verification pass.
- MUST NOT alter production accounting data.
- MUST NOT mark missing provider usage as zero.
- MUST NOT be the same agent that implemented an unreviewed high-impact production change.

## Expected output
A verification record with:
- coverage of known spend sources;
- estimate-vs-actual error;
- hard-limit boundary test result;
- wrap-up behavior result;
- reconciliation completeness;
- task-quality regression result;
- unresolved risks;
- final status: `verified`, `failed`, or `inconclusive`.

## Completion criteria
1. All known spend-producing paths are enumerated.
2. At least one allow, one wrap-up, one hard-block, and one reconciliation path are tested.
3. Cumulative task spend equals the sum of reconciled events within tolerance.
4. Outstanding reservations are explainable.
5. A hard-limit test proves no new expensive call starts beyond the ceiling.
6. Representative tasks retain acceptable correctness/quality.

## Handoff target
Platform owner or workflow owner. Failures involving missing attribution return to the instrumentation owner; failures involving unsafe automatic budget changes escalate to a human owner.
