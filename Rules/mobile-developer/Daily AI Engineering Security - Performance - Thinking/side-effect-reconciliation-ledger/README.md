# Side Effect Reconciliation Ledger

**Category:** Thinking

## Problem
A mutating agent tool can commit an external side effect and still return an error, lose its response, or lose the continuation turn. If the agent interprets that error as proof that nothing happened, a normal retry can create duplicate tasks, messages, approvals, documents, workers, or other mutations.

## Evidence
See `evidence/research.md`. Recent Codex reports include task creation returning failure despite durable task creation, a dynamic-tool routing race where a successful mutation can be masked by another subscriber's error, and an external write surviving a lost post-tool continuation.

## Existing approach
Generic retries, exponential backoff, request-scoped tool IDs, uniqueness constraints, native idempotency keys where available, and manual readback.

## Existing limitations
Backoff does not solve duplicate semantics. Caller-visible transport/tool failure and durable mutation outcome are separate facts. Some APIs lack idempotency keys, and conversation context is not a durable operation ledger.

## Proposed improvement
Persist a stable logical operation key and explicit state machine outside model context. Every ambiguous post-dispatch failure becomes `unknown-after-dispatch`; a read-only reconciliation step must resolve durable state before any retry.

## Architecture
```text
normalized mutation intent
  -> stable operation key + intent hash
  -> prepared
  -> dispatched
  -> result
      success -> confirmed-applied
      proven pre-dispatch rejection -> confirmed-not-applied
      ambiguous error -> unknown-after-dispatch
          -> read-only reconciliation
          -> applied / not-applied / duplicate / unknown
          -> retry only if evidence permits
```

## Actual package tree
```text
side-effect-reconciliation-ledger/
├── README.md
├── evidence/research.md
├── skills/reconcile-ambiguous-side-effect.md
├── rules/idempotency-recovery-rules.md
├── subagents/reconciliation-verifier.md
├── workflows/mutate-confirm-reconcile.md
├── hooks/pre-retry.md
├── scripts/side_effect_ledger.py
└── tests/test_side_effect_ledger.py
```

## Installation
Requires Python 3.10+. No third-party Python packages are required. Store the ledger in durable agent state such as `.agent-state/side-effects.json`; protect it from accidental cleanup and do not store secrets in intent text.

## Usage
Prepare before mutation:
```bash
python scripts/side_effect_ledger.py prepare \
  --file .agent-state/side-effects.json \
  --key create-ticket-20260819-001 \
  --kind create-ticket \
  --intent 'project=alpha;title=bounded retry bug'
```

Mark dispatch:
```bash
python scripts/side_effect_ledger.py transition --file .agent-state/side-effects.json --key create-ticket-20260819-001 --state dispatched
```

On ambiguous failure:
```bash
python scripts/side_effect_ledger.py transition --file .agent-state/side-effects.json --key create-ticket-20260819-001 --state unknown-after-dispatch --evidence 'timeout after request dispatch'
```

After readback finds the object:
```bash
python scripts/side_effect_ledger.py transition --file .agent-state/side-effects.json --key create-ticket-20260819-001 --state confirmed-applied --remote-id TICKET-42 --evidence 'readback matched correlation key'
```

Before any retry:
```bash
python scripts/side_effect_ledger.py retry-check --file .agent-state/side-effects.json --key create-ticket-20260819-001
```

## Workflow
Use `workflows/mutate-confirm-reconcile.md`. The independent `subagents/reconciliation-verifier.md` should own ambiguous outcome classification for high-impact integrations.

## Metrics
Track duplicate mutation rate, stable-key coverage, ambiguous outcomes reconciled before retry, prevented retries, unresolved operation backlog, and reconciliation latency.

## Verification
Run:
```bash
python -m unittest tests/test_side_effect_ledger.py
```
Then integration-test a false-failure scenario: make a disposable mutation succeed in a test service while the caller receives an injected error. Readback must discover the durable mutation and the pre-retry hook must block replay.

## Safety
The ledger never proves external state by itself; confirmation requires downstream evidence. Do not automatically delete suspected duplicates or perform compensating mutations without explicit policy/approval.

## Failure handling
Use at most two read-only reconciliation attempts for an integration with eventual consistency. If still unknown, stop automatic retries and escalate with the operation key and evidence.

## Definition of Done
- every side-effecting operation has stable identity before dispatch;
- dispatched state is persisted;
- ambiguous errors enter `unknown-after-dispatch`;
- no unknown mutation is blindly retried;
- durable readback supports final state;
- retry loops are bounded;
- duplicate incidents are surfaced;
- tests and integration scenario pass.

## Customization
Adapt correlation/readback logic per integration. When a downstream API supports documented idempotency keys, bind the ledger operation key to that key and record the contract/version used.