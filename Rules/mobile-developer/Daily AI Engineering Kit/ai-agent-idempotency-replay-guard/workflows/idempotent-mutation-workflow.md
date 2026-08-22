# Workflow: Idempotent Mutation

## Trigger
Any agent/tool action that can create, send, enqueue, publish, charge, provision, delete, or mutate external/persistent state and may be retried/resumed.

## Entry conditions
Mutation intent is known; target identity and payload can be represented; policy is available.

## Inputs
Task intent, operation manifest, provider/tool capability, execution ledger path/store, actor/executor identity.

## Flow

```text
Trigger
  ↓
Operation Planner
  ↓
Validate manifest + compute fingerprint
  ↓
Lookup ledger by operation_key
  ├─ no record → reserve → execute once → verify outcome → persist
  ├─ succeeded + same fingerprint → reuse recorded result
  ├─ failed-safe-to-retry → bounded retry with SAME operation key
  └─ unknown/conflict → Replay Safety Reviewer → stop/approve/resolve
```

## Stages
1. **Plan** — Operation Planner creates the operation contract.
2. **Preflight** — `validate_operation_manifest.py` validates contract; `fingerprint_operation.py` produces deterministic fingerprint if needed.
3. **Replay gate** — `evaluate_replay_gate.py` checks current ledger state and returns `execute`, `reuse-success`, `safe-retry`, `review-required`, or `blocked`.
4. **Reserve** — create atomic/unique ledger reservation where supported before dispatch.
5. **Execute once** — call the mutating tool using provider-native idempotency key when supported.
6. **Record dispatch evidence** — timestamp, executor, provider request ID, attempt number.
7. **Verify** — query effect or receipt. Distinguish transport success from business success.
8. **Persist final state** — record result fingerprint/resource identity without secrets.
9. **Resume/retry** — repeat replay gate before every resumed action.
10. **Independent review** — mandatory for high-risk `failed-unknown-outcome` or provider without reliable idempotency support.

## Checkpoints
- C1: manifest valid.
- C2: key/fingerprint conflict absent.
- C3: ledger reservation exists before mutation when storage permits.
- C4: retry decision recorded.
- C5: final outcome has verification evidence.

## Retry rules
- Maximum automatic mutation retries: policy `max_mutation_retries` (default 1 after initial attempt).
- Retryable: explicit provider no-effect evidence, pre-dispatch transient failure, provider 429/5xx only when native idempotency protects replay.
- Not retryable automatically: timeout after dispatch without lookup proof, payload conflict, permission failure, validation failure, business rejection.
- Preserve every attempt and first failure evidence.
- Stop when retry budget is exhausted; escalate with ledger evidence.

## Approval points
Human approval is required before destructive/financial/production compensation, replay of a high-risk ambiguous action when duplicate effect cannot be ruled out, or any permission expansion.

## Failure paths
- Manifest invalid → `blocked`.
- Operation key exists with different fingerprint → `blocked-conflict`.
- Previous success → return recorded result, no mutation.
- Ambiguous outcome → read-only reconciliation then independent review.
- Provider lookup unavailable after one transient read retry → stop.

## Outputs
Operation manifest, ledger events, replay-gate decision, provider evidence, reviewer record when needed, final verification status.

## Definition of Done
The intended business effect is verified exactly once or a pre-existing success is safely reused; ledger state matches evidence; no key/fingerprint conflict exists; required review/approval is present; no unresolved duplicate-risk remains.
