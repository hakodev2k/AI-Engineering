# Lifecycle Hooks

## Pre-call validation
**Trigger:** before an external call.  
**Action:** confirm operation intent, timeout, idempotency classification, current circuit state, and expected postcondition.  
**Failure:** unknown side effects or missing timeout blocks automatic execution.  
**Blocking:** yes.

## Post-failure decision
**Trigger:** after any failed attempt.  
**Action:** run `python scripts/resilience_gate.py --policy config/policy.yaml --attempt <n> --idempotent <true|false> --status <code> --error-kind <kind> --output decision.json`.  
**Expected:** action is `retry`, `stop`, or `approval`.  
**Failure:** gate/tool failure blocks further retry.  
**Blocking:** yes.

## Circuit-open hook
**Trigger:** failure threshold opens circuit.  
**Action:** stop new calls, preserve failure evidence, and defer probes until configured open duration elapses.  
**Failure:** bypass is forbidden without explicit approval.  
**Blocking:** yes.

## Final verification
**Trigger:** before declaring the task complete.  
**Action:** Resilience Verifier checks attempt policy and expected postcondition; package integrity can be checked with `python scripts/verify_package.py`.  
**Failure:** return `failed`/`inconclusive`, not success.  
**Blocking:** yes.
