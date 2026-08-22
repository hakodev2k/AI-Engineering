# Lifecycle Hooks

## Post-edit secret scan
**Trigger:** after an agent changes tracked source/configuration files.  
**Preconditions:** Git working tree and scanner dependencies exist.  
**Action:** `python scripts/secret_diff_gate.py --policy config/secret-policy.yaml --output secret-scan-result.json`  
**Expected result:** exit code 0 and `status=passed`.  
**Failure behavior:** exit code 2 blocks further commit/PR preparation; exit code 3 blocks and records tool/environment failure.  
**Blocking:** yes.

## Pre-commit staged scan
**Trigger:** immediately before commit.  
**Preconditions:** intended files are staged.  
**Action:** `python scripts/secret_diff_gate.py --policy config/secret-policy.yaml --staged --output secret-scan-result.json`  
**Expected result:** staged diff contains no blocking finding.  
**Failure behavior:** do not commit; investigate and remediate.  
**Blocking:** yes.

## Final package verification
**Trigger:** after installing/customizing the kit.  
**Action:** `python scripts/verify_package.py`  
**Expected result:** every required package artifact exists and is non-empty.  
**Failure behavior:** package is incomplete and must not be treated as installed.  
**Blocking:** yes.
