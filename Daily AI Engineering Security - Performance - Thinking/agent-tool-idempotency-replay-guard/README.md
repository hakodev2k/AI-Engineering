# Agent Tool Idempotency Replay Guard

## Topic
Prevent duplicate side effects when AI-agent tool calls are replayed, retried, redispatched, or emitted more than once.

## Category
Performance

## Problem
Agent runtimes increasingly combine retries, checkpoints, subagents, queues, and long-running tools. Those mechanisms improve availability, but they can cause the same logical tool operation to execute again after timeout, crash, replay, parent retry, or duplicate model emission. If the tool sends email, creates a payment, enqueues a job, writes a record, or performs another external mutation, duplicate execution can create both correctness damage and avoidable latency/cost.

## Evidence
Current public evidence is documented in [`evidence/research.md`](evidence/research.md). Recent LangGraph/LangChain reports describe long-running tools being re-dispatched, duplicate child scheduling on parent retry, crash-recovery re-execution, and duplicate parallel tool calls. Official LangGraph documentation explicitly notes that tasks may re-execute and recommends idempotency keys or checking existing results.

## Existing approach
Typical defenses are runtime retry policies, checkpointing, task wrappers, provider-native idempotency keys, application dedup tables, argument hashing, or disabling retries for dangerous tools.

## Existing limitations
Checkpoint/retry identity is not the same as business-operation identity. External effects and local completion persistence are not atomic. Providers have inconsistent idempotency support. In-memory dedup cannot survive worker failure. Blind retries after ambiguous transport failures can repeat effects. Disabling retries improves safety at the cost of resilience.

## Proposed improvement
Create a host-side idempotency boundary for every side-effecting tool:

```text
Tool call
  ↓
Effect classification
  ↓
Stable business operation key
  ↓
Atomic durable reservation
  ├─ completed → return saved result
  ├─ in progress → bounded wait / duplicate response
  ├─ unknown → reconcile
  └─ owner → call provider
                   ↓
        success → persist completed result
        ambiguous → mark unknown → reconcile
```

The key design principle is that retries may create new runtime attempts, but they must preserve the same logical operation key.

## Architecture
### Control plane
- `config/policy.json`: retry, lease, identity, and reconciliation defaults.
- `examples/tool-registry.json`: example tool effect classifications.
- `rules/engineering-rules.md`: enforceable behavior.

### Runtime plane
- `scripts/idempotency_guard.py`: deterministic operation-key, reservation, completed-result reuse, unknown-state, and registry validation reference implementation.
- Durable ledger: SQLite in the reference implementation; replace with a shared production data store for multi-worker use.
- Provider reconciliation adapter: application-specific lookup of uncertain writes.

### Verification plane
- `scripts/replay_probe.py`: analyzes normalized execution logs for duplicate provider calls per operation key.
- `tests/test_idempotency_guard.py`: contract tests.
- `verification/verification.md`: required runtime fault matrix and measurement status.

## Package structure
```text
agent-tool-idempotency-replay-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── tool-registry.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── idempotency_guard.py
│   └── replay_probe.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_idempotency_guard.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ for the reference scripts. No third-party package is required.

```bash
python scripts/idempotency_guard.py --help
python scripts/replay_probe.py --help
python tests/test_idempotency_guard.py
```

For production, port the ledger operations to a durable shared store with atomic uniqueness/conditional update semantics.

## Configuration
`config/policy.json` defines:
- operation-key fields and excluded volatile metadata;
- effect-specific max attempts;
- reservation lease and stale thresholds;
- bounded reconciliation policy;
- compact result-storage limits;
- fail-closed behavior.

Tune values to the target provider and workload. Do not raise retry counts without updating the fault-test matrix.

## Usage
### Validate a registry
```bash
python scripts/idempotency_guard.py validate-registry \
  --registry examples/tool-registry.json
```

### Create a stable key
```bash
python scripts/idempotency_guard.py key \
  --tenant tenant-a \
  --workflow checkout \
  --tool create_payment \
  --scope order-1042 \
  --args-json '{"amount_minor":1250,"currency":"USD"}'
```

### Analyze historical attempts
Normalize logs into JSONL with `operation_key`, `tool`, `attempt_id`, `provider_executed`, `status`, and `latency_ms`, then:
```bash
python scripts/replay_probe.py attempts.jsonl --fail-on-duplicate
```

See [`guide-intergration.md`](guide-intergration.md) for runtime wrapping and reconciliation patterns.

## Workflow
Use the sequence in [`workflows/workflows.md`](workflows/workflows.md):
1. establish duplicate-execution baseline;
2. classify tool effects;
3. define stable identity;
4. reserve before execution;
5. reuse completed results;
6. reconcile ambiguous outcomes;
7. fault-test retries/replays;
8. compare before/after metrics;
9. independently verify.

## Skills
[`skills/core-skills.md`](skills/core-skills.md) provides reusable procedures for effect classification, operation identity, reserve-execute-commit, ambiguous-outcome reconciliation, and replay-cost measurement.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines MUST/MUST NOT/SHOULD requirements. Critical rules include durable reservation before writes, stable keys across retries, tenant isolation, and prohibition on blind retry from an `unknown` state.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) separates investigation, identity design, implementation, and independent verification responsibilities so the implementer is not the only verifier.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) specifies startup classification validation, pre-write reservation, completed replay, ambiguous failure, stale lease, post-completion, and release verification hooks.

## Metrics
Measure:
- logical operation count;
- provider execution count;
- duplicate provider executions;
- completed-result hits;
- duplicate suppressions;
- avoided provider calls/cost;
- guard p50/p95 latency;
- contention wait time;
- unknown outcomes;
- reconciliation result counts;
- false collision/suppression incidents.

A performance claim is valid only when before/after data shows fewer redundant provider executions with acceptable guard overhead and no loss of legitimate work.

## Verification
The package deliberately separates:
- **Implemented:** guard logic/config/tests exist;
- **Measured:** target integration produced comparable metrics/fault-test results;
- **Verified:** required replay/crash/concurrency tests passed with zero duplicate effects and no false suppression.

See [`verification/verification.md`](verification/verification.md).

## Safety
- Operation keys must include tenant/security scope.
- Do not persist secrets in the ledger.
- High-value writes should fail closed if identity or durable reservation is unavailable.
- An ambiguous timeout is not proof of failure.
- Human approval is required when a high-impact operation remains `unknown` and provider reconciliation cannot determine whether the effect happened.
- Never bypass an uncertain operation by generating a fresh key.

## Failure handling
### Durable store unavailable
Read tools may follow their independent policy. Side-effecting tools fail closed unless a service-specific safe fallback is explicitly approved.

### Reservation already in progress
Wait/poll only within configured bounds or return a duplicate-in-progress state. Do not invoke the provider in parallel.

### Stale lease
Reconcile provider state before takeover.

### Provider response lost
Mark `unknown` and reconcile using native idempotency/request/business identifiers.

### Completion persistence fails after provider success
Treat the outcome as ambiguous and reconcile. Do not blindly repeat the provider operation.

### Reconciliation remains unknown
Stop automatic retries and escalate according to business risk.

## Definition of Done
A target integration is complete when:
- every production write tool is explicitly classified;
- every write has a stable business-operation identity;
- tenant boundaries are included;
- a durable atomic reservation store is integrated;
- completed results are reusable;
- ambiguous failures reconcile before retry;
- all loops are bounded;
- concurrency, retry, checkpoint replay, crash-after-dispatch, and stale-lease tests pass;
- duplicate side effects are zero in the required test matrix;
- legitimate-operation collision fixtures are zero;
- guard overhead is measured and accepted;
- metrics/alerts are installed;
- an independent verifier approves the evidence.

## Customization
Adapt the registry and reconciliation strategy per provider. Payments should favor provider-native idempotency keys. Email systems can pair the guard with an outbox table. Job systems can enforce unique command IDs. Database writes can use target-version/business-key reconciliation. The state machine and evidence requirements should remain stable even when the storage/provider implementation changes.
