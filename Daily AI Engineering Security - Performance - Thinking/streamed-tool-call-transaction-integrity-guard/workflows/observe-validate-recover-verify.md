# Workflow: Observe → Validate → Recover → Verify

## Trigger
A streamed tool call completes, drops, duplicates, or fails parsing/schema validation.

## Goal
Allow execution only from complete validated calls and recover without duplicate or silent side effects.

## Inputs
Raw fragments, tool schema, call/tool identity, terminal event, execution state, retry count, acceptance criteria.

## Baseline
Measure current malformed-call behavior: calls executed after repair, recovery attempts, unresolved actions, and incorrect completion claims.

## Stages
1. **Observe** — preserve raw fragments and transport events.
2. **Measure baseline** — classify the historical outcome without repair.
3. **Diagnose** — determine completeness, JSON validity, schema validity, identity conflict, and execution state.
4. **Form hypothesis** — identify whether a safe retry can reconstruct a new complete call.
5. **Implement** — run `scripts/transaction_guard.py` before invocation.
6. **Measure again** — replay deterministic fixtures and safe captured traces.
7. **Improved?** — if no, revise recovery handling once; maximum 2 total automatic attempts.
8. **Verify** — independent Transaction Verifier checks state transitions and acceptance gating.

## Responsible agent
Runtime implementation owner for stages 1–7; `subagents/transaction-verifier.md` for final review.

## Tools
`hooks/pre-invocation.md`, `scripts/transaction_guard.py`, JSON/schema validator, immutable logs.

## Outputs
Transaction decision, evidence hash, parsed arguments when ready, retry/reconcile status, verification report.

## Checkpoints
Raw evidence captured; pre-invocation decision; post-recovery decision; independent verification.

## Metrics
Incomplete calls reaching execution, silent repairs, recovery success rate, retries/call, unknown execution states, false completion claims.

## Retry policy
Maximum retries from `config/policy.json` (default 2), only when execution is definitely `not-started`.

## Stop conditions
Stop automatic recovery immediately for identity conflict, unknown write state, or exhausted retry budget.

## Failure path
Surface an explicit failed/unknown transaction fact, preserve evidence, block dependent acceptance criteria, and escalate irreversible unknown writes to a human.

## Verification
Adversarial fixtures must prove partial/malformed/conflicting calls cannot execute and that valid complete calls still pass.

## Definition of Done
Evidence documented; baseline captured; integrity guard integrated; fixtures and safe traces measured; retries bounded; no required unresolved transaction can be reported complete; independent verifier reports no blocking issue.