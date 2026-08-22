# Workflow: Transaction Consistency Review

## Trigger
A change touches multiple writes, explicit/ambient transactions, external side effects near persistence, retries, consumers/jobs, outbox/inbox, or concurrency-sensitive state.

## Entry conditions
Repository is readable; task intent and affected path are identifiable; dangerous production actions are not required to inspect the change.

## Inputs
Task requirements, changed files or target component, test commands, persistence/integration context.

## Context
Repository source/tests, git diff, `config/transaction-gate.yaml`, scanner and assessment schema.

## Stages
1. **Preflight** — workflow owner validates repository/task scope and runs `python scripts/scan-transaction-risk.py <repo> --json`.
2. **Investigate** — Transaction Investigator traces business atomicity, database writes, external effects, retry and concurrency behavior.
3. **Plan** — implementation owner chooses the smallest correction and identifies tests. Prefer existing repository patterns.
4. **Approval checkpoint** — stop before any schema/destructive/production/breaking/irreversible action listed in config.
5. **Execute** — implementation owner makes only the approved/safe source and test changes.
6. **Test** — run targeted rollback/retry/concurrency tests plus relevant build/test suite.
7. **Independent verify** — Transaction Verifier inspects diff, scanner signals, test evidence, and assessment.
8. **Contract validation** — run `python scripts/validate-assessment.py <assessment.json>`.
9. **Complete or recover** — finish only on verified `pass`.

## Produced artifacts
- Scanner JSON/log.
- Structured assessment conforming to `schemas/assessment.schema.json`.
- Test/build evidence.
- Final diff review notes.

## Checkpoints
- Atomicity requirement documented before implementation.
- Every side effect assigned to a consistency strategy.
- Retry/duplicate behavior reviewed.
- Required approvals present before dangerous actions.

## Retry rules
Maximum two fix/retest iterations across stages 5–8. Retryable: implementation defect, deterministic test failure caused by the change, incomplete assessment. Preserve previous scanner output, failing test logs, and verifier findings. Tool/network transient failures may be retried once separately. After budget exhaustion, status becomes `blocked` or `fail` and escalates to a human owner.

## Stop conditions
Verified `pass`; approval required but absent; insufficient evidence; permission/environment prevents verification; or retry budget exhausted.

## Failure paths
- Validation failure → correct assessment, counting toward fix/retest only if source behavior also changes.
- Test failure → preserve logs and return to implementation if budget remains.
- Permission/environment failure → `blocked`, no permission escalation.
- Business rule ambiguity → stop and record open question; do not invent atomicity requirements.

## Definition of Done
Relevant entry points are mapped; high/critical consistency risks are resolved or explicitly blocked; tests pass; diff is independently reviewed; assessment validates; approval boundaries are respected; unresolved risks are recorded.
