# End-to-End Workflow

## Trigger
A task or incident couples a durable state change with external message/event delivery.

## Entry conditions
Repository is available; affected business operation is identifiable; protected actions have not been pre-approved implicitly.

## Inputs
Task/incident description, repository root, acceptance criteria, optional logs/traces, host build/test instructions.

## Stages

### 1. Preflight
Responsible: Repository Explorer.

Run configuration validation and deterministic scan. Locate repository instructions and ensure the target path is readable.

Checkpoint: no environment/permission blocker.

### 2. Context map
Responsible: Repository Explorer.

Trace entry point → durable writes → transaction → publish call → outbox → dispatcher → broker → consumer. Record facts, hypotheses, and failure windows.

Checkpoint: transaction ownership and delivery ownership are evidenced.

### 3. Plan
Responsible: Implementation Agent.

Choose the smallest change that removes the dual-write window. Specify files, tests, migration artifacts if needed, retry/idempotency behavior, and approval requirements.

Approval point: stop before executing schema changes, production changes, destructive operations, breaking contracts, infrastructure/broker changes, secret changes, or security weakening.

### 4. Execute
Responsible: Implementation Agent.

Implement atomic business-state + outbox persistence and bounded dispatcher behavior. Add focused tests. Do not perform protected actions.

### 5. Deterministic checks
Responsible: Implementation Agent.

Run formatter/build/tests and `scripts/scan-outbox-risk.py`. Produce evidence JSON.

Checkpoint: no unexplained blocking finding.

### 6. Independent verification
Responsible: Verification Agent.

Reconstruct behavior, rerun applicable tests, validate evidence, and verify atomic persistence, retry behavior, terminal failure handling, and duplicate tolerance.

### 7. Complete
Status becomes `verified` only when the verifier proves the Definition of Done. Otherwise status is `failed` or `blocked`.

## Retry rules

- Maximum implementation retries: 2.
- Retryable: focused test failure caused by the candidate change, deterministic scanner finding with a clear local repair, transient local tool failure.
- Tool failure: retry once only when clearly transient.
- Preserve on each retry: failing command, exit code, relevant output summary, changed hypothesis, diff scope.
- Escalate after second implementation failure or whenever the required correction broadens scope materially.
- Never retry permission failures by escalating privileges.

## Failure paths

- **Validation failure:** stop; preserve validation output.
- **Build/test failure:** bounded implementation retry.
- **Tool failure:** one transient retry, else stop.
- **Environment failure:** stop if prerequisites cannot be safely restored locally.
- **Permission failure:** stop without escalation.
- **Business-rule ambiguity:** mark blocked if correctness depends on an unresolved product/domain decision.
- **Approval-required action:** stop before action and record required approval.

## Produced artifacts

- repository/transaction map;
- scanner JSON;
- implementation diff/tests;
- evidence JSON matching `schemas/evidence.schema.json`;
- independent verification status.

## Definition of Done

1. Transaction boundary is evidenced.
2. State and outbox persistence are atomic.
3. Publish failure leaves retryable durable work.
4. Successful dispatch is durably finalized.
5. Duplicate delivery is proven safe.
6. Applicable failure-window tests pass.
7. Build/static checks pass.
8. No unexplained blocking scanner finding remains.
9. Evidence validates.
10. Independent review reports `verified`.
11. Required approvals are either not needed or explicitly obtained before their protected action.
12. Remaining risks are documented and non-blocking.
