# Lifecycle Hooks

## Pre-task contract check
**Trigger:** before prompt/model/tool/parser edits that can affect structured output.  
**Preconditions:** baseline schema path is known.  
**Action:** confirm baseline exists and affected consumers/tests are identified.  
**Expected result:** authoritative baseline and consumer scope available.  
**Failure:** stop if baseline is missing or ambiguous.  
**Blocking:** yes.

## Post-edit schema gate
**Trigger:** after candidate schema or contract-affecting edit exists.  
**Preconditions:** baseline and candidate schemas exist.  
**Action:** `python scripts/schema_drift_gate.py --baseline <baseline> --candidate <candidate> --out schema-drift-result.json`.  
**Expected result:** exit 0 and result status `pass` or `warn`.  
**Failure:** preserve result; breaking drift blocks progress.  
**Blocking:** yes.

## Sample validation hook
**Trigger:** when representative outputs are available.  
**Preconditions:** Python package `jsonschema` installed.  
**Action:** add `--samples <samples.json|jsonl>` to the schema gate command.  
**Expected result:** all samples validate candidate schema.  
**Failure:** invalid sample or missing validator blocks verification.  
**Blocking:** yes.

## Test hook
**Trigger:** after remediation.  
**Action:** run `python -m pytest tests/test_schema_drift_gate.py` plus repository-specific parser/contract/integration tests.  
**Expected result:** all affected tests pass.  
**Failure:** one retry only for clearly transient environment/tool failure; deterministic test failures return to remediation.  
**Blocking:** yes.

## Final package verification
**Trigger:** before declaring the kit/package complete.  
**Action:** `python scripts/verify_package.py`.  
**Expected result:** all required package files exist and are non-empty.  
**Failure:** restore missing files or stop.  
**Blocking:** yes.
