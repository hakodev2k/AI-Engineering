# Hooks

## PreTask
**Trigger:** before a new multi-stage task starts.  
**Action:** capture baseline Git/environment state and initialize checkpoint.  
**Command:** `python scripts/validate-checkpoint.py --checkpoint .agent-state/checkpoint-state.json` after initialization.  
**Failure behavior:** stop before material work if checkpoint is invalid.

## PreDangerousAction
**Trigger:** immediately before deployment, schema/destructive changes, secret/config mutation, force push, breaking contract, or uncertain repeat of non-idempotent action.  
**Action:** persist pending action, evidence, idempotency status, and required approval.  
**Command:** checkpoint validator.  
**Failure behavior:** do not execute action without valid checkpoint and explicit approval.

## PostMaterialAction
**Trigger:** after file modifications, successful external side effects, build/test completion, or material failure.  
**Action:** append checkpoint event, changed resources, result evidence, retry fingerprint, and next action.  
**Command:** `python scripts/validate-checkpoint.py --checkpoint .agent-state/checkpoint-state.json`.  
**Failure behavior:** stop additional material actions until state is valid.

## PreResume
**Trigger:** when another session/agent resumes the task.  
**Action:** validate checkpoint and generate deterministic summary.  
**Commands:**
```bash
python scripts/validate-checkpoint.py --checkpoint .agent-state/checkpoint-state.json
python scripts/build-resume-summary.py --checkpoint .agent-state/checkpoint-state.json
```
**Failure behavior:** do not resume execution; reconcile or escalate.

## PreComplete
**Trigger:** before declaring success.  
**Action:** require Verification Agent evidence and status consistency.  
**Command:** checkpoint validator.  
**Failure behavior:** task remains `completed` or `blocked`; it cannot become `verified`.
