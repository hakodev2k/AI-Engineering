# External Tool Commit Reconciliation Guard

**Category:** Thinking  
**Run date:** 2026-08-20 (UTC+7)

## Problem
An AI agent can lose its visible turn after a mutating connector/tool has already committed remotely. The session then has insufficient evidence to distinguish `not executed`, `committed`, and `committed but result lost`. Blind retry can duplicate external writes; refusing to retry can leave work incomplete.

## Evidence
See `evidence/research.md`. Current reports from OpenAI Codex/ChatGPT Work and Microsoft Agent Framework independently show the same boundary failure: external side effect or approved tool execution happens before the agent's durable outcome/continuation is safely settled.

## Existing approach
Common recovery is retry, manual readback, provider-specific idempotency keys, durable checkpoints, or approval-state persistence.

## Existing limitations
A normal checkpoint can preserve intent without proving remote commit. Missing result data is not evidence of non-execution. Idempotency support varies by provider. Approval durability alone does not preserve the executed tool result. Most importantly, ambiguous `unknown` outcomes are often collapsed into generic error/not-found states.

## Proposed improvement
Introduce a durable mutation ledger plus readback-first reconciliation. Create an operation id before dispatch; record intent, risk, argument hash, and any idempotency/business key; track dispatch separately from commit; immediately persist remote id/result fingerprints when available; classify lost continuation as `unknown`; read back target state before retry; allow a mutation retry only after verified absence and documented retry safety, with explicit human approval for dangerous ambiguous retries.

## Architecture
- `skills/mutation-outcome-analysis.md` defines the evidence-driven reasoning procedure.
- `rules/mutation-settlement-rules.md` enforces explicit outcome states and safe retry rules.
- `subagents/mutation-verifier.md` independently verifies remote outcome.
- `workflows/reconcile-before-retry.md` defines the bounded recovery path.
- `hooks/pre-retry-mutation-gate.md` deterministically blocks unsafe retries.
- `scripts/mutation_reconcile.py` makes a safe-action decision from durable evidence and never performs the mutation itself.
- `tests/test_mutation_reconcile.py` verifies committed, unknown, low-risk retry, and high-risk approval cases.

## Package tree
```text
README.md
evidence/research.md
skills/mutation-outcome-analysis.md
rules/mutation-settlement-rules.md
subagents/mutation-verifier.md
workflows/reconcile-before-retry.md
hooks/pre-retry-mutation-gate.md
scripts/mutation_reconcile.py
tests/test_mutation_reconcile.py
```

## Installation
Requires Python 3.9+ and only the standard library. Integrate the ledger at the tool-dispatch boundary so operation identity and intent are durable before remote mutation starts.

## Configuration
For each mutating tool define: risk class (`low`, `medium`, `high`, `irreversible`), safe readback strategy, stable remote/business key fields, whether provider idempotency is supported, retry-safety rules, and which cases require human approval. Never store raw credentials in ledger records.

## Usage
Example record:
```json
{
  "operation_id": "op-20260820-001",
  "dispatch_state": "dispatched",
  "risk": "high",
  "readback": "absent",
  "retry_safe": true,
  "human_approved_retry": false
}
```

Run:
```bash
python3 scripts/mutation_reconcile.py operation.json
python3 -m unittest tests/test_mutation_reconcile.py
```

Exit `0` means the deterministic next action is safe (`retry_allowed` or `reuse_committed_result`). Exit `2` means invalid evidence/configuration. Exit `3` means retry is blocked pending readback, safety proof, or approval.

## Workflow
Use `workflows/reconcile-before-retry.md`: Observe → capture baseline → diagnose dispatch state → form explicit outcome hypothesis → read back → decide → persist evidence → measure again → independently verify. Readback is bounded to two attempts. Mutation retry is bounded to one and only after safety criteria are met.

## Metrics
Track duplicate mutation count, ambiguous outcomes, percentage resolved by readback, mutation retry count, retries avoided because commit was already verified, mean reconciliation latency, unsupported-success count, and human escalation count.

## Verification
A verifier must be able to reproduce the outcome from the durable ledger plus independent target-state readback. `committed` requires remote evidence or equivalent provider-confirmed evidence; missing conversation output is never proof of non-commit. High-risk retries require the configured human approval before execution.

## Safety
The package does not execute mutations. It prevents unsafe retry decisions. Never weaken authorization, approvals, or idempotency rules to recover faster. Never claim exactly-once semantics unless the remote boundary actually supplies them or equivalent guarantees are demonstrated.

## Failure handling
Detection is a lost continuation/tool result after possible dispatch or a duplicate retry request. Evidence is the mutation ledger plus target readback. Retry readback at most twice. If ambiguity persists, preserve `unknown`, block autonomous mutation retry, and escalate with sanitized evidence. For irreversible actions, human approval is mandatory before retry whenever commit cannot be disproved.

## Implemented / Measured / Verified
**Implemented** means the operation ledger and pre-retry gate are wired into the mutation boundary. **Measured** means representative failure scenarios have before/after duplicate/retry/recovery metrics. **Verified** means the target state was independently reconciled, tests pass, and the Mutation Verifier reaches the same outcome classification.

## Definition of Done
Evidence documented; stable operation identity created before dispatch; baseline captured; `unknown` is represented explicitly; readback strategy exists; deterministic gate integrated; tests pass; committed outcomes suppress duplicate retry; retry requires verified absence and retry safety; required approvals are preserved; before/after metrics recorded; independent verification passes; no unresolved blocking ambiguity remains.

## Customization
Add provider-specific adapters that translate real API responses into the generic ledger fields, but keep the decision contract unchanged. If a provider exposes idempotency keys with expiration or scope rules, record those semantics as evidence rather than assuming indefinite replay safety.