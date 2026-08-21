# Lifecycle Hooks

## Pre-implementation requirement gate
**Trigger:** immediately before an implementation agent may edit source code.  
**Preconditions:** requirement contract path is known.  
**Action:** `python scripts/validate-requirement-contract.py <contract.json>` then Requirement Verifier review.  
**Expected result:** validator exits 0 and verifier returns `accepted` for a `ready` contract.  
**Failure:** block implementation; preserve validator/verifier output.  
**Blocking:** yes.

## Post-clarification package check
**Trigger:** after installing or modifying this kit.  
**Preconditions:** Python 3.9+ and package files are readable.  
**Action:** `python scripts/check-package.py` and `python scripts/validate-requirement-contract.py templates/requirement-contract.example.json`.  
**Expected result:** both commands exit 0.  
**Failure:** package is not considered verified; repair missing/broken artifacts before use.  
**Blocking:** yes.

## Pre-handoff status check
**Trigger:** before handing a contract to implementation.  
**Preconditions:** deterministic validation passed.  
**Action:** inspect `status`, `open_questions`, `assumptions`, and `approval_reasons`.  
**Expected result:** status is `ready`, no blocking question/high-risk assumption exists, and approval reasons are empty.  
**Failure:** route to analyst, approval owner, or task owner according to `workflows/ambiguity-gate-workflow.md`.  
**Blocking:** yes.
