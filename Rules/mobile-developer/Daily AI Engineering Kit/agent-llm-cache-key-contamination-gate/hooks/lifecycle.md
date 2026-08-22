# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before analysis or edits.  
**Preconditions:** repository root is available.  
**Action:** run `python scripts/verify_package.py`; confirm cache target and test commands.  
**Expected result:** package assets are complete and target path is known.  
**Failure behavior:** block execution until missing assets/environment issues are resolved.  
**Blocking:** yes.

## Pre-cache-change policy gate
**Trigger:** before implementing cache-key changes.  
**Preconditions:** a representative request JSON exists.  
**Action:** run `python scripts/cache_key_gate.py --request <request.json> --policy config/cache-policy.yaml --output <result.json>`.  
**Expected result:** PASS and a deterministic key.  
**Failure behavior:** do not enable caching for the path; preserve gate output.  
**Blocking:** yes.

## Post-edit test hook
**Trigger:** after cache logic, policy, or tests change.  
**Preconditions:** Python and pytest are available.  
**Action:** run `python -m pytest tests/test_cache_key_gate.py`.  
**Expected result:** all tests pass.  
**Failure behavior:** permit at most two correction cycles, preserving output each time.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before declaring completion.  
**Preconditions:** implementation and project-specific tests are complete.  
**Action:** run package verification, inspect the diff, verify no raw prompts/secrets appear in cache keys/logs, and obtain independent verifier PASS.  
**Expected result:** evidence-backed PASS.  
**Failure behavior:** report BLOCK with exact failed invariant.  
**Blocking:** yes.
