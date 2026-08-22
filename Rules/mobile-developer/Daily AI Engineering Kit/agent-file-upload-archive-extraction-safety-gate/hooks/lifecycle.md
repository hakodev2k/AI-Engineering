# Lifecycle Hooks

## Pre-task validation
**Trigger:** before processing any archive.  
**Preconditions:** archive exists in quarantine.  
**Action:** confirm no prior extraction and policy file exists.  
**Command:** `python scripts/verify_package.py` for package maintenance; application integrations should also validate archive path and quarantine root.  
**Expected result:** package/config is present.  
**Failure:** block processing.  
**Blocking:** yes.

## Pre-extraction gate
**Trigger:** immediately before extraction.  
**Action:** `python scripts/archive_safety_gate.py "$ARCHIVE" --policy config/archive-policy.yaml --output scan-result.json`  
**Expected result:** exit code 0 and status `pass`.  
**Failure:** preserve result, do not extract.  
**Blocking:** yes.

## Extraction hook
**Trigger:** verified pass.  
**Action:** `python scripts/archive_safety_gate.py "$ARCHIVE" --policy config/archive-policy.yaml --extract-to "$ISOLATED_DEST"`  
**Expected result:** contained extraction only.  
**Failure:** stop downstream ingestion and preserve evidence.  
**Blocking:** yes.

## Final verification
**Trigger:** after package or policy changes.  
**Action:** `python -m unittest discover -s tests -p 'test_*.py' && python scripts/verify_package.py`  
**Expected result:** both commands exit 0.  
**Failure:** task is executed but not verified successfully.  
**Blocking:** yes.
