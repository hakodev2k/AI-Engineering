# Lifecycle Hooks

## Pre-merge dependency hook
**Trigger:** dependency manifest or lockfile changes.  
**Preconditions:** candidate SBOM exists.  
**Action:** run `python scripts/license_gate.py --sbom <sbom.json> --policy config/license-policy.yaml --output license-gate-result.json`.  
**Expected result:** exit `0`, `2`, or `4` with structured JSON.  
**Failure behavior:** unexpected non-zero, missing SBOM, or unreadable policy blocks merge recommendation.  
**Blocking:** yes.

## Post-dependency-edit hook
**Trigger:** package version, dependency graph, SBOM, or policy changes.  
**Action:** invalidate stale gate/approval associations and rerun the deterministic gate.  
**Expected result:** current evidence corresponds to current graph.  
**Failure behavior:** stop.  
**Blocking:** yes.

## Pre-exception hook
**Trigger:** gate returns `approval_required`.  
**Action:** require `templates/license-exception-request.md` completion and explicit human approval for exact package/version before adding a narrow exception.  
**Expected result:** approval evidence is present and scoped.  
**Failure behavior:** keep dependency unapproved.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before declaring dependency/license review complete.  
**Action:** run `python scripts/verify_package.py` for package integrity and require License Verifier evidence for the actual repository task.  
**Expected result:** integrity passes and verification is `verified`.  
**Failure behavior:** report incomplete/inconclusive.  
**Blocking:** yes.
