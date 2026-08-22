# Hooks

## Pre-Memory-Write Validation
**Trigger:** before durable memory persistence.  
**Action:** require tenant/source/writer fields, run classifier, attach digest/state/reason codes.  
**Command:** `python scripts/memory_guard.py classify --entry candidate.json --policy config/memory-policy.json`  
**Expected result:** exit 0 for trusted/restricted; exit 2 for quarantined.  
**Failure behavior:** do not write candidate to active retrieval; preserve diagnostics.

## Pre-Retrieval Context Gate
**Trigger:** after backend retrieval, before model context construction.  
**Action:** tenant/state/trust filtering.  
**Command:** `python scripts/memory_guard.py retrieve --store candidates.json --tenant "$TENANT" --policy config/memory-policy.json`  
**Expected result:** only allowed IDs proceed.  
**Failure behavior:** fail closed to no durable-memory context; do not let the model override the gate.

## Post-Derivation Lineage Check
**Trigger:** after summarization, extraction, compaction, or memory merge.  
**Action:** ensure derived memory has parent IDs, inherited tenant, provenance, digest and no implicit trust upgrade.  
**Command:** `python scripts/memory_guard.py audit --store derived-batch.json --policy config/memory-policy.json`  
**Expected result:** exit 0.  
**Failure behavior:** quarantine the derived batch.

## Incident Revocation
**Trigger:** approved incident containment for a poisoned source.  
**Action:** revoke direct memories plus descendants into a new output snapshot.  
**Command:** `python scripts/memory_guard.py revoke --store memory.json --source-id "$SOURCE_ID" --policy config/memory-policy.json --output revoked.json`  
**Expected result:** deterministic revoked-ID set.  
**Failure behavior:** preserve original store, isolate partition, escalate rather than partially purging.

## Final Verification
**Trigger:** package/integration release or incident closure.  
**Action:** run unit tests and store audit.  
**Command:** `python -m unittest tests/test_memory_guard.py` then `python scripts/memory_guard.py audit --store <snapshot> --policy config/memory-policy.json`.  
**Expected result:** all tests pass; audit exit 0; poisoned/cross-tenant probes show zero leakage.  
**Failure behavior:** block release/closure and allow at most two remediation cycles.