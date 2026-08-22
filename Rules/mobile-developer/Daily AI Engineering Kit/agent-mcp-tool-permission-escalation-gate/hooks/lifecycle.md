# Lifecycle Hooks

## Pre-tool-request
**Trigger:** before any MCP/tool invocation.  
**Preconditions:** intended tool/action/resources are known.  
**Action:** create request JSON and run `python scripts/permission_gate.py <request.json>`.  
**Expected result:** `allowed` or deterministic denial/approval-required response.  
**Failure behavior:** block execution.  
**Blocking:** yes.

## Pre-elevated-action
**Trigger:** gate identifies an approval-required action.  
**Preconditions:** request passed structural checks.  
**Action:** require a human approval ID and rerun `python scripts/permission_gate.py <request.json> --approved --approval-id <id>`.  
**Expected result:** exact scoped allow.  
**Failure behavior:** stop without invoking the target tool.  
**Blocking:** yes.

## Post-tool-action
**Trigger:** after an allowed action executes.  
**Preconditions:** gate result and execution evidence exist.  
**Action:** Verification Agent checks action/resource equivalence and acceptance criteria.  
**Expected result:** `verified`.  
**Failure behavior:** mark task unverified and preserve evidence.  
**Blocking:** yes.

## Final-package-check
**Trigger:** package installation or changes.  
**Action:** run `python scripts/verify_package.py` and `python -m unittest tests/test_permission_gate.py`.  
**Expected result:** both exit 0.  
**Failure behavior:** block adoption/merge.  
**Blocking:** yes.
