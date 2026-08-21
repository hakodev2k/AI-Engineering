# Agent Durable Side-Effect Replay Guard

## Topic
Prevent duplicate external side effects when durable AI-agent workflows retry, replay, resume, or recover from checkpoints after crashes/timeouts.

## Category
**Thinking** — execution/recovery reliability, evidence-backed state transitions, and bounded verification for long-running agents.

## Problem
Checkpointed agent runtimes intentionally re-execute unfinished work. An external operation may succeed while the worker crashes before durable completion metadata is recorded. On resume, a retry can send the email twice, duplicate an API mutation, charge twice, create duplicate tickets, repeat provisioning, or otherwise corrupt external state.

The dangerous ambiguity is:

> local runtime says “not completed” ≠ external system proves “not executed”.

## Evidence
`evidence/research.md` documents recent public signals and official guidance. Key evidence includes LangGraph issues reporting duplicate side effects under retry/restart/recovery paths and documentation explicitly requiring idempotent side-effect design because incomplete tasks/nodes may execute again.

## Existing approach
Common protections are checkpointing, putting effects in tasks, provider idempotency keys, read-before-write checks, and in-process deduplication.

## Existing limitations
- Checkpoint state and external provider state are not usually one atomic transaction.
- A task can start, mutate externally, and crash before local completion persists.
- Not every provider offers idempotency keys.
- Read-before-write can race.
- In-memory dedup disappears on restart.
- Blind retry after a timeout cannot distinguish failure from lost acknowledgement.

## Proposed improvement
Add an application-owned durable side-effect state machine:

`missing → in_progress → completed`

with crash ambiguity handled as:

`in_progress --TTL/unknown outcome--> uncertain → reconcile → completed OR retry release`

Every protected mutation follows:

**derive stable semantic identity → atomically claim → execute once → persist safe result reference → reuse on replay**.

An expired claim never automatically becomes retryable. It becomes `uncertain`, forcing provider reconciliation or, for high-risk ambiguous effects, human approval.

## Architecture

```text
Agent / Workflow Runtime
        |
        v
Semantic Identity Builder
(workflow + effect + canonical input)
        |
        v
Durable Claim Ledger  <---- Resume / Retry / Redelivery
        |
        +-- completed --> reuse result, NO provider call
        +-- active -----> wait, NO provider call
        +-- uncertain --> reconcile / approval, NO blind retry
        |
        `-- execute
              |
              v
        External Provider
              |
              v
      safe result reference
              |
              v
       ledger complete
```

The reference implementation is SQLite-backed. Production multi-host deployments should preserve the same protocol on a shared transactional store.

## Package structure

```text
agent-durable-side-effect-replay-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── side_effect_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_side_effect_guard.py
└── workflows/
    └── workflows.md
```

## Installation
Requirements: Python 3.10+ with the standard library. No third-party Python package is required.

From this package directory:

```bash
python scripts/side_effect_guard.py --help
python -m unittest tests/test_side_effect_guard.py
```

For local/single-host persistence:

```bash
export SIDE_EFFECT_LEDGER=.agent-state/side-effect-ledger.sqlite3
```

## Configuration
See `config/policy.json`.

Important defaults:
- claim TTL: 300 seconds;
- blind retry from uncertain: disabled;
- high-risk types include payment/delete/provision/publish/external messaging;
- maximum automated reconciliation attempts: 2;
- raw request/result payload storage: disabled.

The CLI accepts `--ttl` on claim. In production, the host should load/enforce the policy centrally rather than allowing agents to weaken it.

## Usage

### 1. Claim

```bash
python scripts/side_effect_guard.py claim \
  --workflow-id order-123 \
  --effect-type send_invoice_email \
  --owner worker-1-attempt-1 \
  --semantic-json '{"customer_id":"c-1","invoice_id":"i-9"}'
```

Possible decisions:
- `execute`: call provider once;
- `reuse`: return prior result reference;
- `wait`: another owner has an active claim;
- `reconcile`: outcome is uncertain; do not execute.

### 2. Complete after provider success

```bash
python scripts/side_effect_guard.py complete \
  --op-key "$OP_KEY" \
  --owner worker-1-attempt-1 \
  --result-ref provider-object-123
```

### 3. Inspect on resume

```bash
python scripts/side_effect_guard.py status --op-key "$OP_KEY"
```

### 4. Reconcile uncertain state
After read-only provider verification:

```bash
python scripts/side_effect_guard.py resolve \
  --op-key "$OP_KEY" \
  --resolution completed \
  --result-ref provider-object-123 \
  --note "provider lookup confirmed"
```

Only authoritative absence/required approval permits `--resolution retry`.

Full integration guidance is in `guide-intergration.md`.

## Workflow
The primary lifecycle is defined in `workflows/workflows.md`:

1. Observe and baseline current duplicate behavior.
2. Define stable semantic identity.
3. Implement claim → execute → complete.
4. Measure normal replay/concurrency/restart behavior.
5. Inject crash points around provider success and ledger completion.
6. Reconcile uncertainty without mutation.
7. Independently verify provider effect counts.
8. Security-review ledger contents and high-risk approvals.

Every loop is bounded; unresolved ambiguity blocks execution rather than silently increasing retries.

## Skills
`skills/core-skills.md` provides executable procedures for:
- semantic side-effect identity;
- claim/execute/complete;
- uncertain-effect reconciliation;
- crash/replay verification.

## Rules
`rules/engineering-rules.md` contains observable MUST / MUST NOT / SHOULD constraints. The most important invariant is:

**An uncertain external outcome is never treated as proof that the effect did not occur.**

## Subagents
`subagents/subagents.md` separates responsibility across:
- Side-Effect Identity Analyst;
- Guard Implementation Agent;
- Crash/Replay Verification Agent;
- Security & Release Reviewer.

The implementation agent is not the sole verifier for high-risk behavior.

## Hooks
`hooks/hooks.md` defines predictable integration points:
- pre-effect atomic claim;
- post-success completion;
- resume/restart state check;
- uncertainty reconciliation;
- final verification gate.

## Metrics
Minimum production/test metrics:

- `provider_calls_per_operation_key` — target <= 1 for protected effect;
- `duplicate_external_effects` — target 0;
- `completed_replay_additional_calls` — target 0;
- `concurrent_execute_winners_per_key` — target <= 1;
- `uncertain_blind_retries` — target 0;
- `uncertain_count` and `uncertain_age_seconds`;
- `reconciliation_attempts` and resolution category;
- `replay_reuse_count`.

## Verification
Run deterministic unit tests:

```bash
python -m unittest tests/test_side_effect_guard.py
```

Then run provider-specific crash tests in an isolated environment:

1. crash before external call;
2. crash after provider success but before ledger completion;
3. crash after ledger completion;
4. concurrent identical attempts;
5. process/storage reopen and replay.

A release claim must distinguish:

- **Implemented:** guard protocol is wired around the effect.
- **Measured:** provider call/effect counts and ledger states were captured.
- **Verified:** independent crash/replay evidence shows no duplicate and no blind uncertain retry.

## Safety
- The guard never executes provider mutations itself.
- Credentials and raw sensitive payloads must not be stored in the ledger.
- SQLite records safe hashes, state, owner, timestamps, and optional safe result references.
- High-risk uncertain operations require authoritative reconciliation or human approval.
- The package does not replace authn/authz, sandboxing, provider permissions, secret management, or transaction design.
- Do not place separate local ledger files on independent workers and assume cross-worker protection.

## Failure handling

### Ledger unavailable before call
Stop. Do not fail open for a protected effect.

### Provider fails before request transmission is known
Use provider-specific evidence. If non-execution is authoritative, resolve accordingly; otherwise uncertainty rules apply.

### Provider timeout/disconnect after possible transmission
Treat as uncertain. Never blind-retry.

### Provider succeeds, ledger completion fails
Do not repeat provider call. Preserve safe provider correlation metadata and reconcile on resume.

### Active claim expires
The next claim converts it to uncertain. It does not steal ownership and execute.

### Reconciliation remains ambiguous
Maximum two automated attempts, then human escalation for consequential operations.

## Definition of Done
A protected integration is complete only when all are true:

- current public evidence and existing limitations are documented;
- semantic operation identity is explicitly defined;
- every protected mutation has an atomic pre-call claim;
- provider-native idempotency key is used where available;
- successful effects persist a safe result reference;
- completed replay produces zero additional provider calls;
- concurrent same-key attempts yield at most one executor;
- expired/ambiguous outcomes become uncertain;
- uncertain blind retries are zero;
- crash/restart matrix shows zero duplicate external effects;
- unit tests pass;
- ledger contains no secrets/raw sensitive payloads;
- high-risk ambiguity requires evidence or approval;
- independent reviewer verifies the measured result;
- no blocking issue remains.

## Customization
- Replace SQLite with PostgreSQL/SQL Server/Redis-with-durable-transaction semantics while keeping atomic unique claim behavior.
- Add effect-specific semantic schemas and provider reconciliation adapters.
- Adjust TTL according to maximum normal provider latency, but never make TTL expiry equivalent to retry permission.
- Extend high-risk effect types for your domain.
- Add telemetry exporters around structured guard decisions.
- Integrate the guard as middleware around agent tools, queue handlers, LangGraph tasks, background jobs, or API clients.

## Research
See `evidence/research.md` for the evidence/interpretation/proposed-solution separation and public sources used for this package.
