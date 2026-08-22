# Partial Failure Compensation Workflow

## Trigger
Use when one logical task performs multiple external mutations where only some steps may commit before a failure, timeout, crash, or disconnect.

## Entry conditions
- Current repository revision is known.
- `workflow-plan.json` validates against policy.
- Plan fingerprint is frozen.
- Durable execution ledger exists.
- Required approval is available before each protected action, not merely at planning time.

## Inputs
Plan, policy, ledger, provider/read-back tools, approvals, review artifact when required.

## Flow
```text
Trigger
  -> Plan + validate + fingerprint
  -> Initialize durable ledger
  -> For each step
       -> Re-check precondition
       -> Approval checkpoint if required
       -> Execute once with stable operation key
       -> Read back postcondition
       -> Record succeeded / failed / unknown
       -> Stop immediately on failed or unknown
  -> If failure: reconcile actual state
       -> choose forward resume OR compensation OR manual escalation
       -> independent review for high/critical risk
       -> compensation in safe reverse order, verifying each inverse
  -> Final gate
  -> verified / blocked
```

## Stages
### 1. Plan
Owner: Compensation Planner. Produce the plan, validate it, and generate exact fingerprint.

### 2. Initialize ledger
Create one ledger step per plan step with outcome `not-started`, attempts `0`, null evidence, and compensation status `not-needed`.

### 3. Execute one bounded step
Owner: execution agent.
1. Re-read current precondition and record evidence.
2. If `approval_action` is set, stop until explicit human approval exists for that exact action/scope.
3. Execute with the stable operation key.
4. Read authoritative postcondition.
5. Record `succeeded` only when postcondition proves success.
6. Record `failed` only when provider semantics prove no effect occurred.
7. Record `unknown` for timeout/disconnect/ambiguous result.

Checkpoint after every recorded outcome.

### 4. Failure classification
- Transient tool/read failure before mutation: retry once.
- Definite business/validation/permission failure: no automatic retry.
- Unknown mutation outcome: no retry and no compensation until reconciliation.

### 5. Reconciliation
Query actual remote state using operation key/provider request id/business identity. Preserve evidence. If state cannot be proven, stop `blocked`.

### 6. Recovery decision
Choose exactly one:
- **Forward resume**: only when prior successful steps remain valid and failed step can safely run.
- **Compensate**: only for proven successful steps with defined inverse.
- **Manual escalation**: irreversible step, failed compensation, or unresolved business state.

High/critical recovery uses Recovery Reviewer and `evaluate-recovery-gate.py`.

### 7. Compensation
Execute eligible compensations in reverse order when policy requires it. Before each inverse, refresh current state and approval. After each inverse, run declared verification and persist evidence. A failed compensation stops the loop immediately.

### 8. Final verification
Set ledger terminal status to `completed` only when all required forward effects are proven; set `compensated` only when every required inverse is verified. Run `evaluate-final-gate.py`.

## Retry rules
- Transient read/tool failure: max 1 retry per step.
- Recovery attempts: max 2.
- Unknown outcome: zero blind retries.
- Validation/business/permission failure: zero blind retries.
- Compensation failure: zero further automatic compensation after the failure.

## Evidence preserved
Plan/repository fingerprints, preconditions, provider request/operation ids, raw failure class, postconditions, reconciliation results, retries, approvals, reviews, compensation verification.

## Approval points
Explicit human approval before production deployment, destructive SQL, schema/data/file deletion, force push/history rewrite, infrastructure/secret/production-config changes, breaking API contracts, security weakening, irreversible migrations, and large dependency upgrades.

## Stop conditions
Unresolved unknown outcome; stale plan/revision; missing approval; failed deterministic validation; recovery budget exhausted; compensation verification fails; required independent review absent/stale; permissions insufficient.

## Definition of Done
- No `unknown`, `failed`, or `not-started` step remains in a claimed-success path.
- Each succeeded effect has postcondition evidence.
- Each compensated effect has inverse verification evidence.
- Retry/recovery budgets were respected.
- Required review and approvals are current.
- Final gate returns `verified`.
