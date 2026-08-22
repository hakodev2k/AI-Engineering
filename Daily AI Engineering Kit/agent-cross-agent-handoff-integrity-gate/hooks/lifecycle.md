# Lifecycle Hooks

## Pre-handoff validation
**Trigger:** before a producer transfers ownership.  
**Preconditions:** handoff JSON exists.  
**Action:** run `python scripts/handoff_gate.py handoff.json`.  
**Expected result:** exit code 0 and a `passed` JSON summary.  
**Failure behavior:** block transfer; correct deterministic validation errors before retry.  
**Blocking:** yes.

## Artifact verification
**Trigger:** before a consumer relies on local `file:` artifacts.  
**Preconditions:** repository root and referenced files are available.  
**Action:** run `python scripts/handoff_gate.py handoff.json --root . --verify-files`.  
**Expected result:** all local SHA-256 digests match.  
**Failure behavior:** stop consumption and re-establish provenance; never regenerate hashes merely to hide a mismatch.  
**Blocking:** yes.

## High-risk independent verification
**Trigger:** handoff risk contains `production`, `security`, `database`, `infrastructure`, `secrets`, or `breaking-api` and status is moving to `verified`.  
**Preconditions:** independent verifier identity exists and required non-destructive checks have been reproduced.  
**Action:** run `python scripts/handoff_gate.py handoff.json --independent-verifier <verifier-name>`.  
**Expected result:** verifier differs from producer and verification status is `passed`.  
**Failure behavior:** keep status `ready`, `failed`, or `blocked`; do not self-verify.  
**Blocking:** yes.

## Final package verification
**Trigger:** package installation/change and before publishing the kit.  
**Preconditions:** package tree is complete.  
**Action:** run `python scripts/verify_package.py` and `python -m unittest discover -s tests -p 'test_*.py'`.  
**Expected result:** both commands exit 0.  
**Failure behavior:** package must not be reported complete.  
**Blocking:** yes.
