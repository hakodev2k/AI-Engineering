# Workflows

## Workflow 1 — Guarded State-Changing Tool Invocation

**Trigger:** Any tool call classified `idempotent_write` or `non_idempotent_write`.  
**Goal:** Execute one logical side effect at most once from the agent host's perspective, or stop with visible ambiguity.  
**Inputs:** canonical tool identity, validated arguments, intent ID, classification, policy.  
**Baseline:** current duplicate execution rate and retry behavior.  
**Context:** downstream idempotency support, operation-store availability.

### Stages
1. **Classify** — Retry Semantics Analyst confirms write class.
2. **Canonicalize** — host creates stable fingerprint and operation key.
3. **Reserve** — deterministic guard creates a durable record before dispatch.
4. **Checkpoint A** — if duplicate/conflict/in-progress, stop before the tool executes.
5. **Dispatch** — Implementation Agent/host starts the tool and marks `in_progress`.
6. **Capture outcome**:
   - success → `completed` + result reference;
   - proven pre-effect failure → `known_failed`;
   - timeout/disconnect/crash after dispatch → `outcome_unknown`.
7. **Decision** — use `retry-decision`; do not use model prose as the gate.
8. **If retry allowed** — increment attempt and repeat dispatch with the same logical key.
9. **Checkpoint B** — stop when max attempts is reached.
10. **Verify** — Independent Verification Agent checks resulting state and no duplicate side effect.

**Tools:** `scripts/idempotency_guard.py`, durable ledger adapter, target tool.  
**Outputs:** operation record, result reference, deterministic decision.  
**Metrics:** duplicate executions, retry attempts, conflicts, blocks, latency overhead.  
**Retry policy:** at most policy `max_attempts`; identical logical key retained.  
**Stop conditions:** completed/replayed, retry budget exhausted, unresolved ambiguity, conflict, human approval required.  
**Failure path:** preserve ledger and return blocked/unknown; never erase uncertainty.  
**Verification:** current-state inspection plus regression tests.  
**Definition of Done:** exactly one logical outcome is recorded and all configured invariants pass.

## Workflow 2 — Ambiguous Outcome Recovery

**Trigger:** `outcome_unknown` after a state-changing call.  
**Goal:** Determine whether the effect occurred without blind re-execution.  
**Inputs:** operation record, downstream contract, probe configuration.  
**Baseline:** ambiguity unresolved.

### Stages
1. Freeze automatic retries for the operation key.
2. Check verified downstream idempotency support.
3. If guaranteed, retry with the same key within budget.
4. Otherwise run one read-only side-effect probe.
5. Classify probe as `effect_present`, `effect_absent`, or `unknown`.
6. `effect_present` → reconcile result and mark completed when evidence supports it.
7. `effect_absent` → mark known retry-safe state and retry within budget.
8. `unknown` → request explicit human decision or approved compensation plan.

**Responsible agents:** Outcome Reconciliation Agent, Orchestrator.  
**Checkpoints:** probe result must be deterministic and evidence-backed.  
**Retry policy:** one unknown-resolution probe by default; no recursive probing.  
**Stop conditions:** resolved present/absent, human escalation, retry budget exhausted.  
**Failure path:** keep `outcome_unknown`.  
**Verification:** evidence reference tied to the operation key.

## Workflow 3 — Retry/Replay Regression Review

**Trigger:** changes to tool adapters, SDK versions, fallback logic, reconnect/resume, queue middleware, or retry code.  
**Goal:** prove no supported path duplicates non-idempotent work.  
**Inputs:** code diff, policy, fixtures.  
**Baseline:** prior test and metric results.

### Stages
1. Run unit tests before change where possible.
2. Implement change.
3. Test same-key same-arguments duplicate.
4. Test same-key changed-arguments conflict.
5. Test concurrent/in-progress duplicate.
6. Test lost response after simulated effect.
7. Test known pre-effect failure.
8. Test completed replay.
9. Test retry budget exhaustion.
10. Independent verifier compares before/after.

**Retry policy:** one remediation iteration for test failures, then re-run full suite; maximum two remediation cycles.  
**Stop conditions:** suite passes or unresolved safety regression remains.  
**Failure path:** disable automatic state-changing retry or roll back change.  
**Definition of Done:** zero duplicate executions in covered fixtures, conflict detection works, ambiguity is never auto-cleared, and retry budget is enforced.