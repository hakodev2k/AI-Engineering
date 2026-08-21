# Lifecycle Hooks

## Pre-task context validation
**Trigger:** before planning or implementation.  
**Preconditions:** a context manifest exists.  
**Action:** run `python scripts/context_trust_gate.py <manifest> --policy config/trust-policy.json`.  
**Expected result:** exit 0 and status `verified`.  
**Failure behavior:** block execution and preserve errors.  
**Blocking:** yes.

## Post-context-change validation
**Trigger:** after adding, removing, refreshing, or reclassifying any material source or claim.  
**Preconditions:** updated manifest exists.  
**Action:** rerun the context gate and replace only the manifest verification object with deterministic output.  
**Expected result:** status remains `verified`.  
**Failure behavior:** return to Source Curator once; maximum two evidence-refresh retries overall.  
**Blocking:** yes.

## Pre-handoff verification
**Trigger:** before sending context to a planner, implementation agent, incident agent, or reviewer.  
**Preconditions:** Context Verifier completed its independent review.  
**Action:** run the gate a final time and confirm no unresolved high-impact claim remains.  
**Expected result:** gate exit 0.  
**Failure behavior:** handoff is forbidden; escalate with preserved evidence.  
**Blocking:** yes.

## Package self-check
**Trigger:** after installing or modifying this kit.  
**Action:** run `python scripts/verify_package.py` and `python -m unittest tests/test_context_trust_gate.py`.  
**Expected result:** both commands exit 0.  
**Failure behavior:** package is not considered ready.  
**Blocking:** yes.
