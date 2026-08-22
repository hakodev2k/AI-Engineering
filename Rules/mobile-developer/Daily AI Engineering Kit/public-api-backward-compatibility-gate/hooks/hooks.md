# Hooks

## PreTask — Validate baseline inputs
**Trigger:** before compatibility work starts.  
**Action:** validate policy and manifest inputs.  
**Command:**
```bash
python scripts/validate-contract-manifest.py --manifest .compat/baseline-manifest.json
```
**Failure behavior:** blocking. Do not continue with an invalid baseline.

## PostContractExport — Compare contracts
**Trigger:** after candidate contract export.  
**Action:** run deterministic diff.  
**Command:**
```bash
python scripts/compare-contracts.py --baseline .compat/baseline-contract.json --candidate .compat/candidate-contract.json --output .compat/diff.json
```
**Expected result:** valid diff JSON.  
**Failure behavior:** blocking; retry once only for transient I/O.

## PostEdit — Re-export affected contracts
**Trigger:** after edits touching configured public contract paths.  
**Action:** regenerate candidate artifact using repository-specific adapter, then rerun diff.  
**Failure behavior:** blocking if candidate artifact is stale.

## PreMerge — Evaluate compatibility gate
**Trigger:** before merge/release-ready status.  
**Action:**
```bash
python scripts/evaluate-compatibility-gate.py --diff .compat/diff.json --review .compat/review.json --policy config/compatibility-policy.json
```
**Failure behavior:** blocking. Never bypass by replacing the baseline.

## PreComplete — Final identity check
**Trigger:** before declaring verified.  
**Action:** confirm review/diff candidate ref equals current candidate ref and rerun gate/tests after the last contract-affecting edit.  
**Failure behavior:** blocking until evidence is refreshed.
