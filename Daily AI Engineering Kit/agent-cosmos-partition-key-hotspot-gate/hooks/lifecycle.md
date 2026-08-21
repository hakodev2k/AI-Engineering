# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation.  
**Preconditions:** repository is readable and telemetry sample path is known.  
**Action:** confirm `config/policy.yaml`, analysis script, and input CSV exist; confirm CSV header contains `partition_key,request_units`.  
**Command:** `python scripts/analyze_partition_hotspots.py --help` plus a header check.  
**Expected result:** deterministic tooling is available before agent reasoning.  
**Failure behavior:** block investigation on missing/invalid inputs.  
**Blocking:** yes.

## Post-analysis validation
**Trigger:** after generating `hotspot-report.json`.  
**Action:** confirm report status is one of `pass|warn|block`, sample count is non-negative, and every finding includes request/ RU shares and evidence.  
**Expected result:** structured handoff is complete.  
**Failure behavior:** regenerate once from preserved input; if it still fails, stop.  
**Blocking:** yes.

## Pre-change approval gate
**Trigger:** before any partition-key change, container recreation, bulk migration, throughput/config change, or irreversible cutover.  
**Action:** verify explicit human approval and rollback plan exist.  
**Expected result:** approved scope matches proposed action.  
**Failure behavior:** stop without modifying production.  
**Blocking:** yes.

## Final verification
**Trigger:** before declaring success.  
**Action:** run `python scripts/verify_package.py`; for an executed remediation also run functional tests and repeat hotspot analysis using the same methodology.  
**Expected result:** package integrity passes and task evidence satisfies workflow Definition of Done.  
**Failure behavior:** task remains executed-but-unverified.  
**Blocking:** yes.
