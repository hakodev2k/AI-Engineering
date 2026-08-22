# Workflow — Negotiate, Dispatch, Verify

## Trigger
A parent plans to delegate a task whose result is required for downstream reasoning or action.

## Goal
Prevent silent child-result loss caused by channel/tool/schema conflicts.

## Inputs
Caller output requirements, child type/tool catalog, schema, empty-result semantics, fallback channel, `config/output-contract-policy.json`.

## Baseline
Record the current usable-result rate, ambiguous-empty rate, contract retries, and tokens spent on failed child results for a representative workload.

## Stages
1. **Observe** — Identify exactly how the parent consumes the result.
2. **Negotiate** — Normalize accepted channels, schema, status semantics and fallback; generate a contract ID.
3. **Preflight** — Contract Verifier checks required tool availability and contradictory instructions.
4. **Dispatch** — Parent sends the contract with the delegated task.
5. **Collect** — Preserve the raw result envelope/channel metadata without silently coercing it.
6. **Verify** — Check contract ID, channel, status, schema, empty semantics and required evidence.
7. **Recover** — If a diagnosed compatibility problem is safely repairable, modify the contract once and redispatch. Otherwise surface failure/partial state.
8. **Accept** — Parent consumes only a verified result.

## Checkpoints
- Authoritative channel declared before dispatch.
- Mandatory output tool attested.
- Empty result has explicit semantics.
- Result correlation matches the dispatched contract.
- Partial/failure state cannot enter the success path.

## Metrics
Usable-result rate, output-channel mismatch rate, ambiguous-empty rate, retries/task, failed-child token cost, verification coverage.

## Retry policy
Maximum one contract-repair retry. No retry for non-idempotent side effects unless the underlying work has an independent idempotency boundary.

## Stop conditions
Stop on repeated contract failure, unavailable required channel with no fallback, unsafe replay, or missing evidence needed to classify the result.

## Failure path
Return `contract_failure` or `partial` with concrete violations and available evidence. Do not convert absence to a clean result.

## Verification
Run deterministic fixtures through `scripts/output_contract_gate.py`; high-impact reviews also require an independent verifier separate from the implementing/review child.

## Definition of Done
The contract is explicit, preflight passed, result is correlated and validated, any empty state is unambiguous, retries stayed within budget, and downstream acceptance used only verified output.
