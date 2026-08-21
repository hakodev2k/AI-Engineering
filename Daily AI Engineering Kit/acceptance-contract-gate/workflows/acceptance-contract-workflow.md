# Acceptance Contract Workflow

## Entry condition

A non-trivial development task has observable behavior that could be interpreted in more than one way or carries meaningful compatibility/safety risk.

## Required inputs

- raw request;
- repository context;
- relevant tests/contracts/docs;
- project safety rules.

## Stages

### 1. Intake
Owner: Requirement Analyst.

Capture the requested outcome and evidence sources without adding requirements.

Artifact: initial contract metadata.

### 2. Evidence gathering
Owner: Requirement Analyst.

Inspect current behavior, tests, APIs/events, persistence, config, permissions, integrations, and operational constraints relevant to the request.

Checkpoint: source-backed facts must be distinguishable from assumptions.

### 3. Decomposition
Owner: Requirement Analyst.

Create obligations for actors, triggers, inputs, state transitions, outputs, failures, boundaries, invariants, compatibility, and non-goals.

Artifact: `acceptance-contract.json`.

### 4. Deterministic validation
Owner: Hook/script.

Run:

```bash
python scripts/validate-contract.py acceptance-contract.json
python scripts/check-unresolved-obligations.py acceptance-contract.json
```

Structural failure returns to Stage 3.

### 5. Ambiguity challenge
Owner: Ambiguity Challenger.

Attempt to produce alternative plausible implementations, find contradictions, and locate unverifiable obligations.

Decision:

- `READY` → Stage 6;
- `REVISE` → Stage 3;
- `APPROVAL_REQUIRED` → stop for human approval.

Maximum autonomous revision loops: 2.

### 6. Contract gate
Implementation may begin only when:

- schema validation passes;
- no blocking ambiguity is open;
- required approvals are recorded;
- every required obligation specifies verification evidence.

### 7. Implementation
Owner: implementation agent or developer.

Implement only behavior represented by accepted obligations. New material behavior re-opens the contract and returns to Stage 3.

### 8. Verification mapping
Owner: implementation/test agent, then independent review where available.

Map each required obligation to concrete evidence: unit/integration/E2E test, static check, contract diff, migration review, or documented manual verification.

### 9. Pre-completion gate
Run unresolved-obligation checking again. No required obligation may remain `unverified` without the final result explicitly reporting the task as not verified.

## Retry rules

- repository evidence search: at most 2 targeted attempts per unresolved question;
- contract revision loop: at most 2 loops;
- transient test/tool failure: at most 2 retries when evidence indicates a transient cause;
- deterministic validation failure: no blind retry; correct the input first.

## Human approval points

Required before accepting obligations that authorize breaking contracts, destructive data changes, schema changes, security/permission relaxation, production configuration/infrastructure changes, secrets, or irreversible external side effects.

## Stop conditions

Stop when:

- the contract is ready and implementation can safely proceed;
- a human decision is required;
- contradictory authoritative sources cannot be resolved;
- retry/revision limits are exhausted;
- required verification fails.

## Definition of Done

The work is done only when the accepted contract is valid, implementation matches it, every required obligation has verification evidence, required approvals are recorded, and unresolved risk is explicitly reported.
