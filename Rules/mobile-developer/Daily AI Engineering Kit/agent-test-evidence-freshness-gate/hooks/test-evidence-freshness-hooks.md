# Test Evidence Freshness Hooks

## Pre-verification state hook
**Trigger:** before running build/test/analysis.  
**Preconditions:** repository readable; target base known.  
**Action:** capture HEAD/base and generate input fingerprint with `python3 scripts/fingerprint-inputs.py --revision <HEAD> --base-revision <BASE> --file <relevant-file> ... --output evidence/inputs.json`.  
**Expected result:** 64-char SHA-256 fingerprint bound to exact inputs.  
**Failure:** block verification capture.  
**Blocking:** yes.

## Post-verification evidence hook
**Trigger:** after each command finishes.  
**Action:** create an evidence record matching `schemas/evidence-record.schema.json`; preserve command artifacts and status.  
**Expected result:** evidence is attributable to the state used by the command.  
**Failure:** command may be executed, but it is not verified.  
**Blocking:** yes for completion.

## Post-edit/rebase invalidation hook
**Trigger:** any edit, rebase, merge, dependency lockfile/config/test config change.  
**Action:** recompute current fingerprints and run `python3 scripts/evaluate-freshness.py --evidence <record> --policy config/freshness-policy.json --current-revision <HEAD> --current-base-revision <BASE> --current-input-fingerprint <HASH> --output evidence/<id>.evaluation.json`.  
**Expected result:** old passes become `stale` when bindings changed.  
**Failure:** fail closed; do not reuse evidence.  
**Blocking:** yes.

## Pre-merge/final verification hook
**Trigger:** before success claim, merge readiness, release readiness.  
**Action:** evaluate every required evidence record, obtain high-risk review if needed, then run `python3 scripts/evaluate-final-gate.py --evaluation <eval> ... --policy config/freshness-policy.json [--review <review>] [--actors <actors>]`.  
**Expected result:** `status=verified`.  
**Failure:** block completion and list stale/missing/review reasons.  
**Blocking:** yes.

## Failure preservation hook
**Trigger:** failed, stale, unknown, or tool-error outcome.  
**Action:** retain record/evaluation/log references; do not overwrite the previous evidence with a new timestamp.  
**Blocking:** no, but workflow may remain blocked by the underlying result.